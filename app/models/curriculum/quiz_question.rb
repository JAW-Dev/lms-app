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

class Curriculum::QuizQuestion < ApplicationRecord
  resourcify
  acts_as_list scope: :quiz

  belongs_to :quiz
  has_many :answers,
           -> { order(position: :asc) },
           dependent: :destroy,
           class_name: 'Curriculum::QuizQuestionAnswer'

  has_many :user_quiz_question_answers, dependent: :destroy

  validates_presence_of :content
end
