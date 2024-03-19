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

FactoryBot.define do
  factory :order do
    user
    transaction_id { Faker::Alphanumeric.alpha(number: 8) }
    processor { 'SuccessProcessor' }
    qty { 1 }
    sales_tax { 0 }
    notes { Faker::Lorem.paragraphs(number: 3).join(' ') }
  end

  factory :course_order, parent: :order, class: 'CourseOrder' do
    before :create do |order|
      order.billing_address = create(:address)
      cb1 = create(:curriculum_course_behavior)
      cb2 = create(:curriculum_course_behavior)
      order.courses << cb1.course
      order.courses << cb2.course
    end
  end

  factory :bundle_order, parent: :order, class: 'BundleOrder' do
    before :create do |order|
      order.billing_address = create(:address)
      cb = create(:curriculum_course_behavior)
      order.courses << cb.course
    end
  end

  factory :behavior_order, parent: :order, class: 'BehaviorOrder' do
    before :create do |order|
      order.billing_address = create(:address)
      cb_intro = create(:curriculum_course_behavior)
      cb = create(:curriculum_course_behavior, course: cb_intro.course)
      order.courses << cb_intro.course
      order.behaviors << cb.behavior
    end
  end

  factory :subscription_order, parent: :order, class: 'SubscriptionOrder' do
    before :create do |order|
      order.billing_address = create(:address)
      cb1 = create(:curriculum_course_behavior)
      cb2 = create(:curriculum_course_behavior)
      order.courses << cb1.course
      order.courses << cb2.course
    end
  end
end
