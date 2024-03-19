class Admin::Curriculum::BehaviorsController < Admin::AdminController
  before_action :set_behavior, only: %i[show edit update destroy]
  before_action :set_course, only: %i[new create]
  load_and_authorize_resource class: 'Curriculum::Behavior'

  def index
    @behaviors = Curriculum::Behavior.order(title: :asc)
  end

  def show; end

  def new
    @behavior = Curriculum::Behavior.new
  end

  def edit
    @presented_behavior = Curriculum::BehaviorPresenter.new(@behavior)
  end

  def create
    @behavior = Curriculum::Behavior.new(behavior_params)

    if @behavior.save
      if @course.present?
        @course.behaviors << @behavior
        redirect_to admin_curriculum_course_course_behaviors_path(@course),
                    notice: 'Behavior was successfully created.'
      else
        redirect_to admin_curriculum_behaviors_path,
                    notice: 'Behavior was successfully created.'
      end
    else
      render :new
    end
  end

  def update
    respond_to do |format|
      if @behavior.update(behavior_params)
        format.html do
          redirect_to admin_curriculum_behaviors_path,
                      notice: 'Behavior was successfully updated.'
        end
        format.json do
          render status: :ok, json: { position: @behavior.position }
        end
      else
        format.html { render :edit }
        format.json do
          render status: :bad_request,
                 json: {
                   message: 'Error updating behavior.'
                 }
        end
      end
    end
  end

  def destroy
    @behavior.destroy
    redirect_to admin_curriculum_behaviors_path,
                notice: 'Behavior was successfully deleted.'
  end

  private

  def set_behavior
    @behavior = Curriculum::Behavior.friendly.find(params[:id])
  end

  def set_course
    @course =
      if params[:course_id]
        Curriculum::Course.friendly.find(params[:course_id])
      else
        nil
      end
  end

  def behavior_params
    params
      .require(:curriculum_behavior)
      .permit(
        :title,
        :subtitle,
        :sku,
        :price_cents,
        :description,
        :poster,
        :remove_poster,
        :player_uuid,
        :audio_uuid,
        :enabled,
        :exercise_image,
        :example_image,
        resource_ids: []
      )
  end
end
