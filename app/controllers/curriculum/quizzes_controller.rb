class Curriculum::QuizzesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_course

  def show
    @quiz = @course.quiz
    @quiz_result = current_user.quiz_results.last
    authorize! :show, @quiz
  end

  private

  def set_course
    @course = Curriculum::Course.friendly.find(params[:id])
  end
end
