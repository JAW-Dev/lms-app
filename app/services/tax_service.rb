class TaxService
  def initialize(order)
    @order = order
    @client = AvaTax::Client.new(logger: true)
  end

  def calculate_tax
    begin
      transaction = create_transaction('SalesOrder')
      transaction['totalTax']
    rescue StandardError
      0
    end
  end

  def submit_transaction
    create_transaction('SalesInvoice') if Rails.env.production?
  end

  private

  def create_transaction(transaction_type)
    presented_order = OrderPresenter.new(@order)
    transaction_details = {
      code: @order.transaction_id || @order.slug,
      type: transaction_type,
      companyCode: 'ALD',
      date: DateTime.now.strftime('%Y-%m-%dT%H:%M:%S%z'),
      customerCode: @order.user.slug,
      addresses: {
        ShipFrom: {
          line1: '38000 N 93rd Place',
          city: 'Scottsdale',
          region: 'AZ',
          country: 'US',
          postalCode: '85262'
        },
        ShipTo: {
          line1: @order.billing_address.line1,
          line2: @order.billing_address.line2,
          city: @order.billing_address.city,
          region: @order.billing_address&.state&.abbr,
          country: @order.billing_address.country.alpha2,
          postalCode: @order.billing_address.zip
        }
      },
      lines: [
        {
          quantity: @order.qty,
          amount: @order.subtotal.to_f,
          itemCode: presented_order.sku,
          description: presented_order.title
        }
      ]
    }

    @client.create_transaction(transaction_details)
  end
end
