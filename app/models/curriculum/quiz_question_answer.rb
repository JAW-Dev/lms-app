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

class Curriculum::QuizQuestionAnswer < ApplicationRecord
  resourcify
  acts_as_list scope: :quiz_question

  enum status: { incorrect: 0, correct: 1 }

  belongs_to :quiz_question

  has_many :user_quiz_question_answers, dependent: :destroy

  validates_presence_of :content
end
