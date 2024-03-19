class Admin::Curriculum::CourseBehaviorsController < Admin::AdminController
  before_action :set_course_behavior, only: [:update]

  def create
    @course_behavior = Curriculum::CourseBehavior.new(course_behavior_params)

    if @course_behavior.save
      render status: :ok, json: { position: @course_behavior.position }
    else
      render status: :bad_request, json: { message: 'Error updating position.' }
    end
  end

  def index
    @course = Curriculum::Course.friendly.find(params[:course_id])
    @behaviors = (Curriculum::Behavior.all - @course.behaviors).sort_by(&:title)
  end

  def update
    if @course_behavior.update(course_behavior_params)
      render status: :ok, json: { position: @course_behavior.position }
    else
      render status: :bad_request, json: { message: 'Error updating position.' }
    end
  end

  def destroy
    @course_behavior = Curriculum::CourseBehavior.find(params[:id])
    @course_behavior.destroy
  end

  private

  def set_course_behavior
    @course_behavior = Curriculum::CourseBehavior.find(params[:id])
  end

  def course_behavior_params
    params
      .require(:curriculum_course_behavior)
      .permit(:course_id, :behavior_id, :position)
  end
end
