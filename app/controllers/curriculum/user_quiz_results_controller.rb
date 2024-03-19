class Curriculum::UserQuizResultsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_course, only: %i[new create]

  def create
    quiz_result = UserQuizResult.new(user: current_user, quiz: @course.quiz)
    answers = @course.quiz.user_answers(current_user)
    correct_answers =
      answers
        .map { |user_answer| user_answer.quiz_question_answer.correct? ? 1 : 0 }
        .reduce(0.0, :+)
    quiz_result.score = [correct_answers / answers.size, 0.0].max

    if quiz_result.save
      redirect_to curriculum_quiz_path(@course),
                  notice: 'Quiz submitted. Review your results below.'
    else
      redirect_to curriculum_quiz_path(@course),
                  alert: 'Error submitting quiz. Please try again.'
    end
  end

  private

  def set_course
    @course = Curriculum::Course.friendly.find(params[:course_id])
  end
end
