class OrderPresenter < Pres::Presenter
  delegate :qty,
           :subtotal,
           :sales_tax,
           :total,
           :sold_at,
           :user,
           :billing_address,
           :cost_with_discount,
           :gift?,
           :gift,
           :slug,
           :processor,
           :type,
           :discount,
           :discount_cents,
           to: :object

  def order_action
    case object.type
    when 'BehaviorOrder'
      'Purchase Gift'
    when 'BundleOrder'
      'Purchase Bundle'
    when 'SubscriptionOrder'
      'Purchase Subscription'
    else
      'Purchase Complete Course'
    end
  end

  def title
    case object.type
    when 'BehaviorOrder'
      object.behaviors.first.title
    when 'BundleOrder'
      object.courses.first.title
    when 'SubscriptionOrder'
      'Admired Leadership Yearly Subscription'
    else
      'Complete 10-Module Admired Leadership Access'
    end
  end

  def sku
    case object.type
    when 'BehaviorOrder'
      object.behaviors.first.sku
    when 'BundleOrder'
      object.courses.first.sku
    when 'SubscriptionOrder'
      'SUB0001'
    else
      'STE0001'
    end
  end

  def transaction_id
    object.transaction_id.gsub(/^\w+_(.+)/, '\1').slice(0...8)
  end

  def full_address
    [object.billing_address&.line1, object.billing_address&.line2].join(' ')
      .strip
  end

  def payment_details
    PaymentService.new(object.processor).payment_details(object)
  end

  def unit_price
    if object.discount_cents.nonzero?
      object.base_price
    else
      object.cost_with_discount
    end
  end

  def unit_subtotal
    unit_price * object.qty
  end
end
