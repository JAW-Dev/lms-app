class Curriculum::CoursesController < ApplicationController
  before_action :authenticate_user!, except: %i[index show]
  before_action :set_course, only: [:show]
  load_and_authorize_resource class: 'Curriculum::Course'

  def index
    redirect_to "/v2"
    # flash.now[:notice] = 'Start Leading. Sign Up for the Free Introductory Module!' unless flash[:notice] || current_user
    @courses = Curriculum::Course.includes(:behaviors).enabled.order(position: :asc)
    @user = current_user
  end

  def show
    return redirect_to curriculum_courses_url if @course.expandable_display?
    @behaviors =
      @course.behaviors.enabled.includes(
        %i[examples exercises questions behavior_maps courses]
      )
    @next_behavior = UserPresenter.new(current_user).next_behavior(@course)
  end

  private

  def set_course
    @course = Curriculum::Course.friendly.find(params[:id])
  end
end
