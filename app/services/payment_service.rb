class PaymentError < StandardError
end

class PaymentService
  # processors should be service objects that include the processor name
  # followed by "Service" e.g. StripeService
  def initialize(processor = 'Stripe')
    @processor = "#{processor}Service".constantize.new
  end

  def fetch_token
    @processor.fetch_token
  end

  def process_sale(order)
    result = @processor.process_sale(order)
    if result[:success]
      if (order.type === 'CourseOrder' || 'SubscriptionOrder')
        user = order.user
        user.profile.access_type = 'Annual Access'
        user.save
      end
      order.update(
        transaction_id: result[:transaction_id],
        status: :complete,
        sold_at: DateTime.now,
        nonce: nil
      )
      order.courses.each { |course| order.user.add_role(:participant, course) }
      Messenger.customer_order_confirmation(order).deliver_now
      if order.is_a?(CourseOrder)
        Messenger.welcome(order.user.email, order.user.profile.first_name)
          .deliver_now
      end
      if order.is_a?(BehaviorOrder) && order.gift.recipient_email.present?
        Messenger.gift_confirmation(order.gift).deliver_now
      end
      Messenger.admin_order_notification(order).deliver_now
    else
      raise PaymentError.new result[:message]
    end

    result
  end

  def cancel_sale(order)
    @processor.cancel_sale(order)
  end

  def transaction_status(order)
    @processor.transaction_status(order)
  end

  def payment_details(order)
    if order.is_a?(SubscriptionOrder)
      @processor.subscription_details(order)
    else
      @processor.payment_details(order)
    end
  end

  def create_customer(order)
    result = @processor.create_customer(order)
    if result[:success]
      order.user.update(customer_id: result[:id])
    else
      raise PaymentError.new result[:message]
    end

    result
  end

  def add_payment_method(payment_method_id, customer_id)
    result = @processor.add_payment_method(payment_method_id, customer_id)
    raise PaymentError.new result[:message] unless result[:success]

    result
  end

  def remove_payment_method(payment_method_id)
    result = @processor.remove_payment_method(payment_method_id)
    raise PaymentError.new result[:message] unless result[:success]

    result
  end

  def list_payment_methods(user)
    @processor.list_payment_methods(user)
  end

  def process_subscription(order)
    result = @processor.process_subscription(order)

    if result[:success]
      user = order.user
      invite = user.user_invite
      now = DateTime.now

      # get current expiration date before marking this order as complete below
      start = [now, user.access_expiration_date].compact.sort.last

      order.update(
        transaction_id: result[:id],
        status: :complete,
        sold_at: now,
        nonce: nil,
        payment_method_id: nil
      )
      order.courses.each { |course| user.add_role(:participant, course) }

      Messenger.customer_order_confirmation(order).deliver_now
      Messenger.renewal_complete(order).deliver_now
      Messenger.admin_order_notification(order).deliver_now
    else
      raise PaymentError.new result[:message]
    end

    result
  end

  def cancel_subscription(order)
    result = @processor.cancel_subscription(order)
    raise PaymentError.new result[:message] unless result[:success]
  end

  def process_resubscription(order)
    result = @processor.process_resubscription(order)
    raise PaymentError.new result[:message] unless result[:success]
  end
end
