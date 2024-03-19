# == Schema Information
#
# Table name: user_quiz_question_answers
#
#  id                      :bigint(8)        not null, primary key
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  quiz_question_answer_id :bigint(8)        not null
#  quiz_question_id        :bigint(8)        not null
#  user_id                 :bigint(8)        not null
#

class UserQuizQuestionAnswer < ApplicationRecord
  belongs_to :user
  belongs_to :quiz_question, class_name: 'Curriculum::QuizQuestion'
  belongs_to :quiz_question_answer, class_name: 'Curriculum::QuizQuestionAnswer'
end
