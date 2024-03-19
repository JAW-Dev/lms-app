require 'rails_helper'
require 'faker'

feature 'User' do
  before :each do
    @user = create(:user)
    @user.confirm

    @exercise = create(:curriculum_exercise)
    @course = create(:curriculum_course)
    @course.behaviors = [@exercise.behavior]
  end

  scenario 'is not authorized view the admin list of exercises' do
    sign_in @user
    visit admin_curriculum_behavior_exercises_path(@exercise.behavior)

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

    @exercise = create(:curriculum_exercise)
    @course = create(:curriculum_course)
    @course.behaviors = [@exercise.behavior]
  end

  scenario 'views the admin list of exercises' do
    sign_in @manager
    visit admin_curriculum_behavior_exercises_path(@exercise.behavior)

    expect(page).to have_selector 'table > tbody tr', count: 1
  end

  scenario 'creates an exercise' do
    sign_in @manager
    visit admin_curriculum_behavior_exercises_path(@exercise.behavior)
    click_link 'Create an Exercise'

    expect {
      within('form') do
        fill_in 'Description', with: Faker::Lorem.paragraph
        click_button 'Create Exercise'
      end
    }.to change { Curriculum::Exercise.count }.by(1)

    expect(current_path).to eq(
      admin_curriculum_behavior_exercises_path(@exercise.behavior)
    )
    expect(page).to have_content 'Exercise was successfully created'
  end

  scenario 'updates an exercise' do
    sign_in @manager
    visit admin_curriculum_behavior_exercises_path(@exercise.behavior)
    click_link 'Edit'

    within('form') do
      fill_in 'Description', with: Faker::Lorem.paragraph
      click_button 'Update Exercise'
    end

    expect(current_path).to eq(
      admin_curriculum_behavior_exercises_path(@exercise.behavior)
    )
    expect(page).to have_content 'Exercise was successfully updated'
  end

  scenario 'updates an exercise with no description' do
    sign_in @manager
    visit admin_curriculum_behavior_exercises_path(@exercise.behavior)
    click_link 'Edit'

    within('form') do
      fill_in 'Description', with: ''
      click_button 'Update Exercise'
    end

    expect(page).to have_content 'Something went wrong'
  end

  scenario 'deletes an exercise' do
    sign_in @manager
    visit admin_curriculum_behavior_exercises_path(@exercise.behavior)

    expect { first(:xpath, '//a[text()="Delete"]').click }.to change {
      Curriculum::Exercise.count
    }.by(-1)
    expect(current_path).to eq(
      admin_curriculum_behavior_exercises_path(@exercise.behavior)
    )
    expect(page).to have_content 'Exercise was successfully deleted'
  end

  scenario 'reorders an exercise', js: true do
    @other_exercise = create(:curriculum_exercise, behavior: @exercise.behavior)
    @third_exercise = create(:curriculum_exercise, behavior: @exercise.behavior)
    sign_in @manager
    visit admin_curriculum_behavior_exercises_path(@exercise.behavior)

    find("#exercise-#{@exercise.id}").drag_to(
      find("#exercise-#{@third_exercise.id}")
    )

    expect { @exercise.reload.position == 3 }.to become_truthy
  end
end
