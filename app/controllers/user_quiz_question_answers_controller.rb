class UserQuizQuestionAnswersController < ApplicationController
  before_action :authenticate_user!

  def create
    user_answer =
      UserQuizQuestionAnswer.find_or_initialize_by(
        user: current_user,
        quiz_question_id: user_quiz_question_answer_params[:quiz_question_id]
      )
    user_answer.quiz_question_answer_id =
      user_quiz_question_answer_params[:quiz_question_answer_id]
    if user_answer.save
      render status: :ok,
             json: {
               answer_id: user_answer.quiz_question_answer.id,
               question_id: user_answer.quiz_question_id,
               status: user_answer.quiz_question_answer.status
             }
    else
      render status: :bad_request, json: { message: 'Error submitting answer.' }
    end
  end

  private

  def user_quiz_question_answer_params
    params
      .require(:user_quiz_question_answer)
      .permit(:quiz_question_id, :quiz_question_answer_id)
  end
end
