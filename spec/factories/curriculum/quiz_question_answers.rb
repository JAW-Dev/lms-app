# == Schema Information
#
# Table name: curriculum_quiz_question_answers
#
#  id               :bigint(8)        not null, primary key
#  content          :text
#  position         :integer
#  status           :integer          default("incorrect")
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  quiz_question_id :bigint(8)        not null
#

FactoryBot.define do
  factory :curriculum_quiz_question_answer,
          class: 'Curriculum::QuizQuestionAnswer' do
    association :quiz_question, factory: :curriculum_quiz_question
    content { Faker::Lorem.paragraph }
    position { nil }
  end
end
