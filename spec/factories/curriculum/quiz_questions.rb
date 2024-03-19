# == Schema Information
#
# Table name: curriculum_quiz_questions
#
#  id         :bigint(8)        not null, primary key
#  content    :text
#  position   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  quiz_id    :bigint(8)        not null
#

FactoryBot.define do
  factory :curriculum_quiz_question, class: 'Curriculum::QuizQuestion' do
    association :quiz, factory: :curriculum_quiz
    content { Faker::Lorem.paragraph }
    position { nil }
  end
end
