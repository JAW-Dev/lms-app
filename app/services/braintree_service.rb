class BraintreeService
  def initialize
    @gateway =
      Braintree::Gateway.new(
        environment: :sandbox,
        merchant_id:
          Rails.application.credentials[Rails.env.to_sym].dig(
            :braintree,
            :merchant_id
          ),
        public_key:
          Rails.application.credentials[Rails.env.to_sym].dig(
            :braintree,
            :public_key
          ),
        private_key:
          Rails.application.credentials[Rails.env.to_sym].dig(
            :braintree,
            :private_key
          )
      )
  end

  def process_sale(order)
    result =
      @gateway.transaction.sale(
        amount: order.total.to_s,
        payment_method_nonce: order.nonce,
        options: {
          submit_for_settlement: true
        }
      )

    Rails.logger.info result.errors.inspect if result.respond_to?(:errors)

    {
      transaction_id: result.transaction&.id,
      success: result.success?,
      status: result.transaction&.status,
      message: result.try(:message)
    }
  end

  def cancel_sale(order)
    false
  end

  def transaction_status(order)
    result = @gateway.transaction.find(order.transaction_id)
    result.status
  end

  def fetch_token
    @gateway.client_token.generate
  end
end
