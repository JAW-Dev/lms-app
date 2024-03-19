class Admin::Curriculum::CoursesController < Admin::AdminController
  before_action :set_course, only: %i[show edit update destroy]
  load_and_authorize_resource class: 'Curriculum::Course'

  def index
    @courses = Curriculum::Course.order(position: :asc)
  end

  def show; end

  def new
    @course = Curriculum::Course.new
  end

  def edit; end

  def create
    @course = Curriculum::Course.new(course_params)
    if @course.save
      redirect_to admin_curriculum_courses_path,
                  notice: 'Module was successfully created.'
    else
      render :new
    end
  end

  def update
    respond_to do |format|
      if @course.update(course_params)
        format.html do
          redirect_to admin_curriculum_courses_path,
                      notice: 'Module was successfully updated.'
        end
        format.json { render status: :ok, json: { position: @course.position } }
      else
        format.html { render :edit }
        format.json do
          render status: :bad_request,
                 json: {
                   message: 'Error updating course.'
                 }
        end
      end
    end
  end

  def destroy
    @course.destroy
    redirect_to admin_curriculum_courses_path,
                notice: 'Module was successfully deleted.'
  end

  private

  def set_course
    @course = Curriculum::Course.friendly.find(params[:id])
  end

  def course_params
    params
      .require(:curriculum_course)
      .permit(
        :title,
        :sku,
        :description,
        :poster,
        :remove_poster,
        :position,
        :enabled,
        :display,
        :icon
      )
  end
end
