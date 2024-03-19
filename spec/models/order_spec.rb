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

require 'rails_helper'

RSpec.describe Order, type: :model do
  it 'has a valid factory (CourseOrder)' do
    expect(create(:course_order)).to be_valid
  end

  it 'has a valid factory (BundleOrder)' do
    expect(create(:bundle_order)).to be_valid
  end

  it 'has a valid factory (BehaviorOrder)' do
    expect(create(:behavior_order)).to be_valid
  end

  it 'has a valid factory (SubscriptionOrder)' do
    expect(create(:subscription_order)).to be_valid
  end

  it 'has a minimum qty of one' do
    expect(build(:order, qty: 0)).to be_invalid
  end

  it 'returns the correct discount for a free gift (BehaviorOrder)' do
    order = build(:behavior_order)
    expect(order.discount_amount).to eq(1)
  end

  it 'returns the correct discount for a non-free behavior (BehaviorOrder)' do
    gift = create(:behavior_order, status: :complete)
    order = create(:behavior_order, user: gift.user)
    expect(order.discount_amount).to eq(0)
  end

  it 'has an associated gift (BehaviorOrder)' do
    order = create(:behavior_order)
    expect(order.gift?).to be(true)
  end

  it 'returns the correct cost for all courses (CourseOrder)' do
    order = create(:course_order)
    expect(order.cost_with_discount).to eq(Money.from_amount(1000))
  end

  it 'returns the correct cost for a free gift (BehaviorOrder)' do
    order = create(:behavior_order)
    expect(order.cost_with_discount).to eq(Money.from_amount(0))
  end

  it 'returns the correct cost for a behavior (BehaviorOrder)' do
    gift = create(:behavior_order, status: :complete)
    order = create(:behavior_order, user: gift.user)
    expect(order.cost_with_discount).to eq(Money.from_amount(25))
  end

  it 'returns the correct cost for a renewal (SubscriptionOrder)' do
    order = create(:subscription_order)
    expect(order.cost_with_discount).to eq(Money.from_amount(200))
  end
end
