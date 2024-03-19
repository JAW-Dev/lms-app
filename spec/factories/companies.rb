# == Schema Information
#
# Table name: companies
#
#  id         :bigint(8)        not null, primary key
#  city       :string
#  line_one   :string
#  line_two   :string
#  name       :string
#  phone      :string
#  slug       :string
#  zip        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  country_id :bigint(8)
#  state_id   :bigint(8)
#

FactoryBot.define do
  factory :company do
    country
    state
    name { Faker::Company.name }
    line_one { Faker::Address.street_address }
    line_two { Faker::Address.secondary_address }
    city { Faker::Address.city }
    zip { Faker::Address.zip }
    phone { Faker::PhoneNumber.phone_number }
  end
end
