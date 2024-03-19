class V2Controller < ApplicationController
  before_action :authenticate_user!, unless: :skip_auth_for_path?
  before_action :set_course, only: [:show]
  load_and_authorize_resource class: "Curriculum::Course"
  layout "v2"

  def index
    @courses = Curriculum::Course.includes(:behaviors).enabled.order(position: :asc)
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

  def skip_auth_for_path?
    # Add paths that don't require authentication here
    unauthenticated_paths = [
      '/v2',
      '/v2/contact-us',
      '/v2/gift/expired',
      '/v2/users/access',
      '/v2/users/access/direct',
      '/v2/users/access/me',
      '/v2/users/access/team',
      '/v2/users/access/nonprofit'
    ]
    unauthenticated_paths.include?(request.path)
  end
end
