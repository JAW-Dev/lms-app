# == Schema Information
#
# Table name: countries
#
#  id         :bigint(8)        not null, primary key
#  alpha2     :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do
  factory :country do
    name { Faker::Address.country }
    alpha2 { Faker::Address.country_code }
  end
end
