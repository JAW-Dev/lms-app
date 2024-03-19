class Admin::Curriculum::ExercisesController < Admin::AdminController
  before_action :set_behavior, only: %i[index new create]
  before_action :set_exercise, only: %i[show edit update destroy]
  load_and_authorize_resource class: 'Curriculum::Exercise'

  def index
    @exercises = @behavior.exercises
  end

  def show; end

  def new
    @exercise = Curriculum::Exercise.new(behavior: @behavior)
  end

  def edit; end

  def create
    @exercise = Curriculum::Exercise.new(exercise_params)
    @exercise.behavior = @behavior

    if @exercise.save
      redirect_to admin_curriculum_behavior_exercises_path(@exercise.behavior),
                  notice: 'Exercise was successfully created.'
    else
      render :new
    end
  end

  def update
    respond_to do |format|
      if @exercise.update(exercise_params)
        format.html do
          redirect_to admin_curriculum_behavior_exercises_path(
                        @exercise.behavior
                      ),
                      notice: 'Exercise was successfully updated.'
        end
        format.json do
          render status: :ok, json: { position: @exercise.position }
        end
      else
        format.html { render :edit }
        format.json do
          render status: :bad_request,
                 json: {
                   message: 'Error updating exercise.'
                 }
        end
      end
    end
  end

  def destroy
    @exercise.destroy
    redirect_to admin_curriculum_behavior_exercises_path(@exercise.behavior),
                notice: 'Exercise was successfully deleted.'
  end

  private

  def set_behavior
    @behavior = Curriculum::Behavior.friendly.find(params[:behavior_id])
  end

  def set_exercise
    @exercise = Curriculum::Exercise.find(params[:id])
  end

  def exercise_params
    params
      .require(:curriculum_exercise)
      .permit(:behavior_id, :image, :remove_image, :description, :position)
  end
end
