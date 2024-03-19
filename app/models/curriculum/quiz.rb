# == Schema Information
#
# Table name: curriculum_quizzes
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  course_id   :bigint(8)        not null
#

class Curriculum::Quiz < ApplicationRecord
  resourcify
  belongs_to :course

  has_many :questions,
           -> { order(position: :asc) },
           dependent: :destroy,
           class_name: 'Curriculum::QuizQuestion'

  def user_answers(user)
    questions
      .includes(:user_quiz_question_answers)
      .where({ user_quiz_question_answers: { user_id: user.id } })
      .flat_map(&:user_quiz_question_answers)
  end

  def complete?(user)
    questions.size == user_answers(user).size
  end
end
