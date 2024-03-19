# == Schema Information
#
# Table name: curriculum_bundles
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  enabled     :boolean          default(TRUE)
#  image       :string
#  name        :string
#  sku         :string
#  slug        :string
#  subheading  :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  company_id  :bigint(8)
#

FactoryBot.define do
  factory :curriculum_bundle, class: 'Curriculum::Bundle' do
    name { Faker::Company.catch_phrase }
    subheading { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraphs(number: 3).join(' ') }
    enabled { true }
    sku { "BUN#{Faker::Number.number(digits: 5)}" }
  end
end
