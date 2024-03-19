# == Schema Information
#
# Table name: user_quiz_results
#
#  id         :bigint(8)        not null, primary key
#  score      :float
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  quiz_id    :bigint(8)        not null
#  user_id    :bigint(8)        not null
#

FactoryBot.define do
  factory :user_quiz_result do
    user
    association :quiz, factory: :curriculum_quiz
    score { Faker::Number.within(range: 50..100) / 100.0 }
  end
end
