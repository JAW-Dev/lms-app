# == Schema Information
#
# Table name: addresses
#
#  id           :bigint(8)        not null, primary key
#  city         :string
#  company_name :string
#  full_name    :string
#  line1        :string
#  line2        :string
#  type         :string
#  zip          :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  country_id   :bigint(8)
#  order_id     :bigint(8)        not null
#  state_id     :bigint(8)
#

FactoryBot.define do
  factory :address, class: 'BillingAddress' do
    order
    type { 'BillingAddress' }
    line1 { Faker::Address.street_address }
    line2 { Faker::Address.secondary_address }
    city { Faker::Address.city }
    state
    country
    zip { Faker::Address.zip }
  end
end
