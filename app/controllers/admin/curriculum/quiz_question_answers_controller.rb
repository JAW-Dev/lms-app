class Admin::Curriculum::QuizQuestionAnswersController < Admin::AdminController
  before_action :set_quiz_question_answer, only: %i[show edit update destroy]
  before_action :set_quiz_question, only: %i[new create]
  load_and_authorize_resource class: 'Curriculum::QuizQuestionAnswer'

  def new
    @quiz_question_answer =
      Curriculum::QuizQuestionAnswer.new(quiz_question: @quiz_question)
  end

  def edit; end

  def create
    @quiz_question_answer =
      Curriculum::QuizQuestionAnswer.new(quiz_question_answer_params)
    @quiz_question_answer.quiz_question = @quiz_question

    if @quiz_question_answer.save
      redirect_to edit_admin_curriculum_quiz_question_path(@quiz_question),
                  notice: 'Answer was successfully created.'
    else
      render :new
    end
  end

  def update
    respond_to do |format|
      if @quiz_question_answer.update(quiz_question_answer_params)
        format.html do
          redirect_to edit_admin_curriculum_quiz_question_path(
                        @quiz_question_answer.quiz_question
                      ),
                      notice: 'Answer was successfully updated.'
        end
        format.json do
          render status: :ok, json: { position: @quiz_question_answer.position }
        end
      else
        format.html { render :edit }
        format.json do
          render status: :bad_request,
                 json: {
                   message: 'Error updating answer.'
                 }
        end
      end
    end
  end

  def destroy
    @quiz_question_answer.destroy
    redirect_to edit_admin_curriculum_quiz_question_path(
                  @quiz_question_answer.quiz_question
                ),
                notice: 'Answer was successfully deleted.'
  end

  private

  def set_quiz_question
    @quiz_question = Curriculum::QuizQuestion.find(params[:quiz_question_id])
  end

  def set_quiz_question_answer
    @quiz_question_answer = Curriculum::QuizQuestionAnswer.find(params[:id])
  end

  def quiz_question_answer_params
    params
      .require(:curriculum_quiz_question_answer)
      .permit(:content, :status, :position)
  end
end
