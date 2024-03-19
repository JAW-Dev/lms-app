class StripeService
  def initialize
    Stripe.api_key =
      Rails.application.credentials[Rails.env.to_sym].dig(:stripe, :private_key)
  end

  def fetch_token
    SecureRandom.uuid
  end

  def process_sale(order)
    begin
      user = order.user
      presented_order = OrderPresenter.new(order)

      metadata = {
        name: order&.billing_address&.full_name,
        company: order&.billing_address&.company_name,
        email: user&.email,
        module: presented_order&.title,
        SKU: presented_order&.sku,
        address: presented_order&.full_address,
        country: order&.billing_address&.country&.alpha2,
        city: order&.billing_address&.city,
        state: order&.billing_address&.state&.abbr,
        zip: order&.billing_address&.zip,
        tax: order&.sales_tax&.to_s
      }

      if user.has_role?(:company_rep, user.company)
        metadata.merge!(
          { company: user.company.name, phone: user.company.phone }
        )
      end

      result =
        Stripe::Charge.create(
          {
            amount: order.total_cents,
            currency: 'usd',
            source: order.nonce,
            metadata: metadata
          }
        )

      {
        transaction_id: result.id,
        success: result.status == 'succeeded',
        status: result.status,
        message: result.outcome.try(:seller_message)
      }
    rescue Stripe::CardError => e
      Rails.logger.info e.error.message.inspect

      {
        transaction_id: -1,
        success: false,
        status: 'error',
        message: e.error.message
      }
    rescue Stripe::InvalidRequestError => e
      Rails.logger.info e.error.message.inspect

      {
        transaction_id: -1,
        success: false,
        status: 'error',
        message: 'Invalid request.'
      }
    end
  end

  def cancel_sale(order)
    false
  end

  def transaction_status(order)
    resp = Stripe::Charge.retrieve(order.transaction_id)
    resp.status
  end

  def payment_details(order)
    resp = Stripe::Charge.retrieve(order.transaction_id)
    resp.payment_method_details
  end

  def subscription_details(order)
    resp =
      Stripe::Subscription.retrieve(
        id: order.transaction_id,
        expand: %w[latest_invoice.payment_intent]
      )
    if resp.latest_invoice.payment_intent.present? &&
         resp.latest_invoice.payment_intent.charges.any?
      resp
        .latest_invoice
        .payment_intent
        .charges
        .select { |charge| charge.status == 'succeeded' }
        .sort { |a, b| b.created <=> a.created }
        &.first
        &.payment_method_details
    end
  end

  def subscription_full_details(order)
    Stripe::Subscription.retrieve(order.transaction_id)
  end

  def create_customer(order)
    customer = {
      name: order&.billing_address&.full_name,
      email: order&.user&.email,
      address: {
        line1: order&.billing_address&.line1,
        line2: order&.billing_address&.line2,
        city: order&.billing_address&.city,
        state: order&.billing_address&.state&.abbr,
        postal_code: order&.billing_address&.zip,
        country: order&.billing_address&.country&.alpha2
      }
    }
    begin
      customer_id = order.user.customer_id
      resp = Stripe::Customer.create(customer) unless customer_id.present?
      customer_id ||= resp.id

      {
        id: customer_id,
        success: true,
        status: 'success',
        message: 'Customer created'
      }
    rescue => e
      Rails.logger.info e.error.message.inspect

      { id: nil, success: false, status: 'error', message: e.error.message }
    end
  end

  def add_payment_method(payment_method_id, customer_id)
    begin
      # TODO: remove once we migrate to PaymentIntents
      user = User.find_by(customer_id: customer_id)
      UserPresenter
        .new(user)
        .payment_methods
        .each { |payment_method| remove_payment_method(payment_method.id) }

      Stripe::PaymentMethod.attach(payment_method_id, { customer: customer_id })

      Stripe::Customer.update(
        customer_id,
        invoice_settings: {
          default_payment_method: payment_method_id
        }
      )

      {
        id: payment_method_id,
        success: true,
        status: 'success',
        message: 'Payment method added'
      }
    rescue Stripe::CardError => e
      { id: nil, success: false, status: 'error', message: e.error.message }
    end
  end

  def remove_payment_method(payment_method_id)
    begin
      Stripe::PaymentMethod.detach(payment_method_id)

      {
        id: payment_method_id,
        success: true,
        status: 'success',
        message: 'Payment method removed'
      }
    rescue Stripe::CardError => e
      { id: nil, success: false, status: 'error', message: e.error.message }
    end
  end

  def list_payment_methods(user)
    begin
      resp =
        Stripe::PaymentMethod.list({ customer: user.customer_id, type: 'card' })
      resp.data
    rescue StandardError
      []
    end
  end

  def process_subscription(order)
    begin
      result =
        Stripe::Subscription.create(
          {
            customer: order.user.customer_id,
            items: [
              {
                price:
                  Rails.application.credentials[Rails.env.to_sym].dig(
                    :stripe,
                    :subscription_price
                  )
              }
            ],
            trial_end:
              if order.user&.subscription_start_date&.future?
                order.user.subscription_start_date.to_i
              else
                'now'
              end,
            expand: %w[latest_invoice.payment_intent]
          }
        )

      {
        id: result.id,
        success: true,
        status: 'success',
        message: 'Subscription created'
      }
    rescue => e
      { id: nil, success: false, status: 'error', message: e.error.message }
    end
  end

  def cancel_subscription(order)
    begin
      result =
        Stripe::Subscription.update(
          order.transaction_id,
          { prorate: false, cancel_at_period_end: true }
        )

      {
        id: result.id,
        success: true,
        status: 'success',
        message: 'Subscription cancelled'
      }
    rescue => e
      { id: nil, success: false, status: 'error', message: e.error.message }
    end
  end

  def process_resubscription(order)
    begin
      result =
        Stripe::Subscription.update(
          order.transaction_id,
          { cancel_at_period_end: false }
        )

      {
        id: result.id,
        success: true,
        status: 'success',
        message: 'Resubscribed'
      }
    rescue => e
      { id: nil, success: false, status: 'error', message: e.error.message }
    end
  end

  def retrieve_subscription(user)
    return nil if !user.customer_id
    active_subs = Stripe::Subscription.list({ customer: user.customer_id }).data
    canceled_subs =
      Stripe::Subscription.list(
        { customer: user.customer_id, status: 'canceled' }
      ).data
    all_subs = active_subs + canceled_subs
    return all_subs.first if all_subs.length == 1
    clean_up_subscriptions(active_subs, canceled_subs)
  rescue => e
    return nil
  end

  # Functionality: Cancels unwanted active/trialing subscriptions if any.
  # Returns: Stripe subscription object
  # Idea: Trialing subscritpions has highest priority, then active, then canceled. If there is any trialing sub,
  # then a trialing sub will return. If there are no trialing subs, but active subs, an active sub will return.
  # If there are no trialing/active subs, then a canceled sub will return
  def clean_up_subscriptions(active_subs, canceled_subs)
    if active_subs.any?
      t_subs, a_subs = active_subs.partition { |s| s.status == 'trialing' }
      if t_subs.any?
        a_subs.each { |s| s.delete }
        return t_subs.first if t_subs.length == 1
        latest_t_sub = t_subs.max_by { |s| s.current_period_end }
        t_subs.each { |s| s.delete if s != latest_t_sub }
        p latest_t_sub.id
        return latest_t_sub
      end
      if a_subs.any?
        latest_a_sub = a_subs.max_by { |s| s.current_period_end }
        a_subs.each { |s| s.delete if s != latest_a_sub }
        return latest_a_sub
      end
    end
    canceled_subs.each { |s| p s.canceled_at }

    return cancled_subs.first if canceled_subs.length == 1
    canceled_subs.max_by { |s| s.current_period_end }
  end
end
