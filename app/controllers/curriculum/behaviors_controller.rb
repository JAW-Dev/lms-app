class Curriculum::BehaviorsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_behavior
  before_action :set_course
  load_and_authorize_resource class: 'Curriculum::Behavior'

  def show
    return redirect_to curriculum_courses_url if @course.expandable_display?
    @media_type = params[:media_type]
    @note =
      Curriculum::Note.find_or_create_by(user: current_user, notable: @behavior)
  end
  
  private

  def set_behavior
    @behavior = Curriculum::Behavior.friendly.find params[:id]
  end


  def set_course
    if params[:bundle_id].present?
      @bundle = Curriculum::Bundle.friendly.find(params[:bundle_id])
      bundle_course =
        @bundle
          .bundle_courses
          .joins(:behaviors)
          .find_by(curriculum_behaviors: { slug: params[:id] })
      @course = bundle_course.course
      @behaviors = bundle_course.behaviors
    else
      @course = Curriculum::Course.friendly.find(params[:course_id])
      @behaviors = @course.behaviors.enabled.includes(:courses)
    end
  end
end
