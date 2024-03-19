module OrderHelper
  def card_type(card_name)
    cards = {
      'amex' => 'American Express',
      'jcb' => 'JCB',
      'diners' => "Diner's Club",
      'unionpay' => 'UnionPay'
    }

    cards[card_name] || card_name&.titleize
  end

  def card_icon(card_name)
    icons = { 'diners' => 'fab fa-cc-diners-club' }
    icons[card_name] || "fab fa-cc-#{card_name}"
  end

  def display_price(price)
    price.zero? ? 'Free' : humanized_money_with_symbol(price)
  end
end
