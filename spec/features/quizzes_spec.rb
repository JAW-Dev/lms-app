require 'rails_helper'
require 'faker'

feature 'Admin' do
  before :each do
    @manager = create(:user)
    @manager.confirm
    @manager.add_role :manager
    @manager.add_role :admin

    @course = create(:curriculum_course)
    @course.behaviors << create(:curriculum_behavior)
  end

  scenario 'creates a quiz' do
    sign_in @manager
    visit edit_admin_curriculum_course_path(@course)
    click_link 'Edit Module Quiz'

    expect {
      within('#quiz_form') do
        fill_in 'Description', with: Faker::Lorem.paragraph
        click_button 'Create Quiz'
      end
    }.to change { Curriculum::Quiz.count }.by(1)

    expect(current_path).to eq(edit_admin_curriculum_quiz_path(@course.quiz))
    expect(page).to have_content 'Quiz was successfully created'
  end

  scenario 'updates a quiz' do
    @quiz = create(:curriculum_quiz, course: @course)

    sign_in @manager
    visit edit_admin_curriculum_course_path(@course)
    click_link 'Edit Module Quiz'

    within('#quiz_form') do
      fill_in 'Description', with: Faker::Lorem.paragraph
      click_button 'Update Quiz'
    end

    expect(current_path).to eq(edit_admin_curriculum_quiz_path(@quiz))
    expect(page).to have_content 'Quiz was successfully updated'
  end

  scenario 'creates a question' do
    @quiz = create(:curriculum_quiz, course: @course)

    sign_in @manager
    visit edit_admin_curriculum_quiz_path(@quiz)

    expect {
      within('#question_form') do
        fill_in 'Add New Question', with: Faker::Lorem.sentence
        click_button 'Add Question'
      end
    }.to change { Curriculum::QuizQuestion.count }.by(1)

    expect(current_path).to eq(edit_admin_curriculum_quiz_path(@quiz))
    expect(page).to have_content 'Question was successfully created'
  end

  scenario 'reorders a question', js: true do
    @quiz = create(:curriculum_quiz, course: @course)
    @q1 = create(:curriculum_quiz_question, quiz: @quiz)
    @q2 = create(:curriculum_quiz_question, quiz: @quiz)
    @q3 = create(:curriculum_quiz_question, quiz: @quiz)

    sign_in @manager
    visit edit_admin_curriculum_quiz_path(@quiz)

    find("#quiz_question-#{@q1.id}").drag_to(find("#quiz_question-#{@q3.id}"))

    expect { @q1.reload.position == 3 }.to become_truthy
  end

  scenario 'deletes a question' do
    @quiz = create(:curriculum_quiz, course: @course)
    @q1 = create(:curriculum_quiz_question, quiz: @quiz)
    @q2 = create(:curriculum_quiz_question, quiz: @quiz)

    sign_in @manager
    visit edit_admin_curriculum_quiz_path(@quiz)

    expect { first(:xpath, '//a[text()="Delete"]').click }.to change {
      Curriculum::QuizQuestion.count
    }.by(-1)
    expect(current_path).to eq(edit_admin_curriculum_quiz_path(@quiz))
    expect(page).to have_content 'Question was successfully deleted'
  end

  scenario 'creates an answer' do
    @quiz_question = create(:curriculum_quiz_question)

    sign_in @manager
    visit edit_admin_curriculum_quiz_question_path(@quiz_question)

    expect {
      within('#answer_form') do
        fill_in 'Add New Answer', with: Faker::Lorem.sentence
        click_button 'Add Answer'
      end
    }.to change { Curriculum::QuizQuestionAnswer.count }.by(1)

    expect(current_path).to eq(
      edit_admin_curriculum_quiz_question_path(@quiz_question)
    )
    expect(page).to have_content 'Answer was successfully created'
  end

  scenario 'reorders an answer', js: true do
    @quiz_question = create(:curriculum_quiz_question)
    @a1 =
      create(:curriculum_quiz_question_answer, quiz_question: @quiz_question)
    @a2 =
      create(:curriculum_quiz_question_answer, quiz_question: @quiz_question)
    @a3 =
      create(:curriculum_quiz_question_answer, quiz_question: @quiz_question)

    sign_in @manager
    visit edit_admin_curriculum_quiz_question_path(@quiz_question)

    find("#quiz_question_answer-#{@a1.id}").drag_to(
      find("#quiz_question_answer-#{@a3.id}")
    )

    expect { @a1.reload.position == 3 }.to become_truthy
  end

  scenario 'deletes an answer' do
    @quiz_question = create(:curriculum_quiz_question)
    @a1 =
      create(:curriculum_quiz_question_answer, quiz_question: @quiz_question)
    @a2 =
      create(:curriculum_quiz_question_answer, quiz_question: @quiz_question)

    sign_in @manager
    visit edit_admin_curriculum_quiz_question_path(@quiz_question)

    expect { first(:xpath, '//a[text()="Delete"]').click }.to change {
      Curriculum::QuizQuestionAnswer.count
    }.by(-1)
    expect(current_path).to eq(
      edit_admin_curriculum_quiz_question_path(@quiz_question)
    )
    expect(page).to have_content 'Answer was successfully deleted'
  end
end
