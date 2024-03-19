# == Schema Information
#
# Table name: curriculum_questions
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  position    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)
#

FactoryBot.define do
  factory :curriculum_question, class: 'Curriculum::Question' do
    association :behavior, factory: :curriculum_behavior
    description { Faker::Lorem.paragraph }
    position { nil }
  end
end
