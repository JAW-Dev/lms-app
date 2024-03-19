json.order do
  json.extract! @order, :status, :qty
  json.cart do
    json.title present(@order).title
    json.base_price(
      if @order.base_price.zero?
        'Free'
      else
        humanized_money_with_symbol(@order.base_price)
      end
    )
    json.price(
      if @order.cost_with_discount.zero?
        'Free'
      else
        humanized_money_with_symbol(@order.cost_with_discount)
      end
    )
    json.discount(
      @order.discount.zero? ? nil : humanized_money_with_symbol(@order.discount)
    )
  end
  json.subtotal humanized_money_with_symbol(@order.subtotal)
  json.sales_tax humanized_money_with_symbol(@order.sales_tax)
  json.total humanized_money_with_symbol(@order.total)
  json.enterprise current_user.has_role?(:company_rep, current_user.company)
  json.gift @order.gift?
  json.full_name(
    if @order.user.profile.has_name?
      ProfilePresenter.new(@order.user.profile).full_name
    else
      false
    end
  )
  json.errors @order.errors.full_messages
  json.order_type @order.class.to_s.underscore
end

json.token @token
