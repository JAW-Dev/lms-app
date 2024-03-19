module OrderService
  def export(type: :all)
    file_path = "#{Rails.root}/tmp/orders_#{type}.csv"
    records = []

    order_types = {
      gift: ['BehaviorOrder'],
      course: ['CourseOrder'],
      renewal: ['SubscriptionOrder']
    }

    orders =
      Order.complete.where(
        type:
          order_types[type] || %w[CourseOrder BehaviorOrder SubscriptionOrder]
      )

    CSV.open(file_path, 'w') do |csv|
      headers = [
        'order id',
        'type',
        'sku',
        'item',
        'email',
        'name',
        'address',
        'state',
        'country',
        'sold on',
        'subtotal',
        'tax',
        'total'
      ]
      headers += ['recipient name', 'recipient email', 'status'] if type ==
        :gift
      csv << headers
      orders.find_each do |order|
        presented_order = OrderPresenter.new(order)
        row = [
          presented_order.transaction_id.upcase,
          type.to_s.titleize,
          presented_order.sku,
          presented_order.title,
          order.user.email,
          ProfilePresenter.new(order.user.profile).full_name,
          presented_order.full_address,
          order.billing_address&.state&.abbr || 'N/A',
          order.billing_address&.country&.name || 'N/A',
          order.sold_at.strftime('%m/%d/%y'),
          order.subtotal.to_s,
          order.sales_tax.to_s,
          order.total.to_s
        ]

        row += [
          order&.gift&.recipient_name || 'N/A',
          order&.gift&.recipient_email || 'N/A',
          order&.gift&.status&.humanize || 'N/A'
        ] if type == :gift

        csv << row
      end
    end

    file_path
  end

  extend self
end
