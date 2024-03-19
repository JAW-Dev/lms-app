# == Schema Information
#
# Table name: states
#
#  id         :bigint(8)        not null, primary key
#  abbr       :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  country_id :bigint(8)
#

FactoryBot.define do
  factory :state do
    country
    name { Faker::Address.state }
    abbr { Faker::Address.state_abbr }
  end
end
