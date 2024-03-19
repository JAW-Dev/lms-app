class Admin::Curriculum::QuestionsController < Admin::AdminController
  before_action :set_behavior, only: %i[index new create]
  before_action :set_question, only: %i[show edit update destroy]
  load_and_authorize_resource class: 'Curriculum::Question'

  def index
    @questions = @behavior.questions
  end

  def show; end

  def new
    @question = Curriculum::Question.new(behavior: @behavior)
  end

  def edit; end

  def create
    @question = Curriculum::Question.new(question_params)
    @question.behavior = @behavior

    if @question.save
      redirect_to admin_curriculum_behavior_questions_path(@question.behavior),
                  notice: 'Question was successfully created.'
    else
      render :new
    end
  end

  def update
    respond_to do |format|
      if @question.update(question_params)
        format.html do
          redirect_to admin_curriculum_behavior_questions_path(
                        @question.behavior
                      ),
                      notice: 'Question was successfully updated.'
        end
        format.json do
          render status: :ok, json: { position: @question.position }
        end
      else
        format.html { render :edit }
        format.json do
          render status: :bad_request,
                 json: {
                   message: 'Error updating question.'
                 }
        end
      end
    end
  end

  def destroy
    @question.destroy
    redirect_to admin_curriculum_behavior_questions_path(@question.behavior),
                notice: 'Question was successfully deleted.'
  end

  private

  def set_behavior
    @behavior = Curriculum::Behavior.friendly.find(params[:behavior_id])
  end

  def set_question
    @question = Curriculum::Question.find(params[:id])
  end

  def question_params
    params
      .require(:curriculum_question)
      .permit(:behavior_id, :description, :position)
  end
end
