require 'rails_helper'
require 'faker'

feature 'User' do
  before :each do
    @user = create(:user)
    @user.confirm

    @question = create(:curriculum_question)
    @course = create(:curriculum_course)
    @course.behaviors = [@question.behavior]
  end

  scenario 'is not authorized view the admin list of questions' do
    sign_in @user
    visit admin_curriculum_behavior_questions_path(@question.behavior)

    expect(current_path).to eq(root_path)
    expect(page).to have_content 'log in or sign up'
  end
end

feature 'Admin' do
  before :each do
    @manager = create(:user)
    @manager.confirm
    @manager.add_role :manager
    @manager.add_role :admin

    @question = create(:curriculum_question)
    @course = create(:curriculum_course)
    @course.behaviors = [@question.behavior]
  end

  scenario 'views the admin list of questions' do
    sign_in @manager
    visit admin_curriculum_behavior_questions_path(@question.behavior)

    expect(page).to have_selector 'table > tbody tr', count: 1
  end

  scenario 'creates a question' do
    sign_in @manager
    visit admin_curriculum_behavior_questions_path(@question.behavior)
    click_link 'Create a Question'

    expect {
      within('form') do
        fill_in 'Description', with: Faker::Lorem.paragraph
        click_button 'Create Question'
      end
    }.to change { Curriculum::Question.count }.by(1)

    expect(current_path).to eq(
      admin_curriculum_behavior_questions_path(@question.behavior)
    )
    expect(page).to have_content 'Question was successfully created'
  end

  scenario 'updates a question' do
    sign_in @manager
    visit admin_curriculum_behavior_questions_path(@question.behavior)
    click_link 'Edit'

    within('form') do
      fill_in 'Description', with: Faker::Lorem.paragraph
      click_button 'Update Question'
    end

    expect(current_path).to eq(
      admin_curriculum_behavior_questions_path(@question.behavior)
    )
    expect(page).to have_content 'Question was successfully updated'
  end

  scenario 'updates a question with no description' do
    sign_in @manager
    visit admin_curriculum_behavior_questions_path(@question.behavior)
    click_link 'Edit'

    within('form') do
      fill_in 'Description', with: ''
      click_button 'Update Question'
    end

    expect(page).to have_content 'Something went wrong'
  end

  scenario 'deletes a question' do
    sign_in @manager
    visit admin_curriculum_behavior_questions_path(@question.behavior)

    expect { first(:xpath, '//a[text()="Delete"]').click }.to change {
      Curriculum::Question.count
    }.by(-1)
    expect(current_path).to eq(
      admin_curriculum_behavior_questions_path(@question.behavior)
    )
    expect(page).to have_content 'Question was successfully deleted'
  end

  scenario 'reorders a question', js: true do
    @other_question = create(:curriculum_question, behavior: @question.behavior)
    @third_question = create(:curriculum_question, behavior: @question.behavior)
    sign_in @manager
    visit admin_curriculum_behavior_questions_path(@question.behavior)

    find("#question-#{@question.id}").drag_to(
      find("#question-#{@third_question.id}")
    )

    expect { @question.reload.position == 3 }.to become_truthy
  end
end
