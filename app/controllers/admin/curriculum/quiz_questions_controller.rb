class Admin::Curriculum::QuizQuestionsController < Admin::AdminController
  before_action :set_quiz_question, only: %i[show edit update destroy]
  before_action :set_quiz, only: %i[new create]
  load_and_authorize_resource class: 'Curriculum::QuizQuestion'

  def edit; end

  def create
    @quiz_question = Curriculum::QuizQuestion.new(quiz_question_params)
    @quiz_question.quiz = @quiz

    if @quiz_question.save
      redirect_to edit_admin_curriculum_quiz_path(@quiz),
                  notice: 'Question was successfully created.'
    else
      render :new
    end
  end

  def update
    respond_to do |format|
      if @quiz_question.update(quiz_question_params)
        format.html do
          redirect_to edit_admin_curriculum_quiz_path(@quiz_question.quiz),
                      notice: 'Question was successfully updated.'
        end
        format.json do
          render status: :ok, json: { position: @quiz_question.position }
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
    @quiz_question.destroy
    redirect_to edit_admin_curriculum_quiz_path(@quiz_question.quiz),
                notice: 'Question was successfully deleted.'
  end

  private

  def set_quiz
    @quiz = Curriculum::Quiz.find(params[:quiz_id])
  end

  def set_quiz_question
    @quiz_question = Curriculum::QuizQuestion.find(params[:id])
  end

  def quiz_question_params
    params
      .require(:curriculum_quiz_question)
      .permit(:quiz_id, :content, :position)
  end
end
