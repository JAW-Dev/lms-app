class HelpToHabitController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :set_course, only: [:show]
  load_and_authorize_resource class: "Curriculum::Course"
  layout "v2"

  def index
    redirect_back(fallback_location: root_path) if !current_user&.has_beta_access?
    @user = current_user
  end

  def show
    return redirect_to curriculum_courses_url if @course.expandable_display?
    @behaviors = @course.behaviors.enabled.includes([:examples, :exercises, :questions, :behavior_maps, :courses])
    @next_behavior = UserPresenter.new(current_user).next_behavior(@course)
  end

  private

  def set_course
    @course = Curriculum::Course.friendly.find(params[:id])
  end
end
