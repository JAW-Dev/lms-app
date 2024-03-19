# == Schema Information
#
# Table name: orders
#
#  id                 :bigint(8)        not null, primary key
#  discount_cents     :integer          default(0), not null
#  notes              :text
#  processor          :string
#  qty                :integer          default(1)
#  sales_tax_cents    :integer          default(0), not null
#  sales_tax_currency :string           default("USD"), not null
#  slug               :string
#  sold_at            :datetime
#  status             :integer          default("pending")
#  subtotal_cents     :integer          default(0), not null
#  subtotal_currency  :string           default("USD"), not null
#  type               :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  transaction_id     :string
#  user_id            :bigint(8)
#

class CourseOrder < Order
  def base_price
    Money.from_amount(1000)
  end

  def order_behaviors
    courses.includes(:behaviors).flat_map(&:behaviors)
  end

  private

  def update_discount
    self.discount_cents = user&.user_invite&.discount_cents || 0
  end
end
