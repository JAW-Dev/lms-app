require 'faker'

class SuccessProcessorService
  def process_sale(order)
    {
      transaction_id: Faker::Alphanumeric.alpha(number: 8),
      success: true,
      status: 'processing',
      message: 'Order received'
    }
  end

  def process_subscription(order)
    {
      id: Faker::Alphanumeric.alpha(number: 8),
      success: true,
      status: 'success',
      message: 'Subscription created'
    }
  end

  def payment_details(order)
    OpenStruct.new({ card: OpenStruct.new({ brand: 'visa', last4: '1111' }) })
  end

  def subscription_details(order)
    payment_details(order)
  end
end

class FailProcessorService
  def process_sale(order)
    {
      transaction_id: nil,
      success: false,
      status: 'error',
      message: 'Payment declined'
    }
  end
end
