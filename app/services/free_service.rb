class FreeService
  def process_sale(order)
    {
      transaction_id: SecureRandom.uuid,
      success: true,
      status: 'succeeded',
      message: ''
    }
  end

  def cancel_sale(order)
    false
  end

  def transaction_status(order)
    order.status
  end

  def payment_details(order)
    nil
  end

  def fetch_token
    SecureRandom.uuid
  end
end
