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

class BundleOrder < Order
  def discount_amount
    0.2
  end

  def order_behaviors
    courses.flat_map(&:behaviors)
  end
end
