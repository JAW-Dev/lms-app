# == Schema Information
#
# Table name: curriculum_examples
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  position    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)
#

FactoryBot.define do
  factory :curriculum_example, class: 'Curriculum::Example' do
    association :behavior, factory: :curriculum_behavior
    description { Faker::Lorem.paragraph }
    position { nil }
  end
end
