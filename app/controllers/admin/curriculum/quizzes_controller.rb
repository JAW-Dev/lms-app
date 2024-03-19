class Admin::Curriculum::QuizzesController < Admin::AdminController
  before_action :set_quiz, only: %i[edit update destroy]
  before_action :set_course, only: %i[new create]
  load_and_authorize_resource class: 'Curriculum::Quiz'

  def new
    @quiz = Curriculum::Quiz.new(course: @course)
  end

  def edit; end

  def create
    @quiz = Curriculum::Quiz.new(quiz_params)
    @quiz.course = @course

    if @quiz.save
      redirect_to edit_admin_curriculum_quiz_path(@quiz),
                  notice: 'Quiz was successfully created.'
    else
      render :new
    end
  end

  def update
    if @quiz.update(quiz_params)
      redirect_to edit_admin_curriculum_quiz_path(@quiz),
                  notice: 'Quiz was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @quiz.destroy
    redirect_to admin_curriculum_course_path(@quiz.course),
                notice: 'Quiz was successfully deleted.'
  end

  private

  def set_course
    @course = Curriculum::Course.friendly.find(params[:course_id])
  end

  def set_quiz
    @quiz = Curriculum::Quiz.find(params[:id])
  end

  def quiz_params
    params.require(:curriculum_quiz).permit(:description)
  end
end
