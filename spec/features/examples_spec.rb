require 'rails_helper'
require 'faker'

feature 'User' do
  before :each do
    @user = create(:user)
    @user.confirm

    @example = create(:curriculum_example)
    @course = create(:curriculum_course)
    @course.behaviors = [@example.behavior]
  end

  scenario 'is not authorized view the admin list of examples' do
    sign_in @user
    visit admin_curriculum_behavior_examples_path(@example.behavior)

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

    @example = create(:curriculum_example)
    @course = create(:curriculum_course)
    @course.behaviors = [@example.behavior]
  end

  scenario 'views the admin list of examples' do
    sign_in @manager
    visit admin_curriculum_behavior_examples_path(@example.behavior)

    expect(page).to have_selector 'table > tbody tr', count: 1
  end

  scenario 'creates an example' do
    sign_in @manager
    visit admin_curriculum_behavior_examples_path(@example.behavior)
    click_link 'Create an Example'

    expect {
      within('form') do
        fill_in 'Description', with: Faker::Lorem.paragraph
        click_button 'Create Example'
      end
    }.to change { Curriculum::Example.count }.by(1)

    expect(current_path).to eq(
      admin_curriculum_behavior_examples_path(@example.behavior)
    )
    expect(page).to have_content 'Example was successfully created'
  end

  scenario 'updates an example' do
    sign_in @manager
    visit admin_curriculum_behavior_examples_path(@example.behavior)
    click_link 'Edit'

    within('form') do
      fill_in 'Description', with: Faker::Lorem.paragraph
      click_button 'Update Example'
    end

    expect(current_path).to eq(
      admin_curriculum_behavior_examples_path(@example.behavior)
    )
    expect(page).to have_content 'Example was successfully updated'
  end

  scenario 'updates an example with no description' do
    sign_in @manager
    visit admin_curriculum_behavior_examples_path(@example.behavior)
    click_link 'Edit'

    within('form') do
      fill_in 'Description', with: ''
      click_button 'Update Example'
    end

    expect(page).to have_content 'Something went wrong'
  end

  scenario 'deletes an example' do
    sign_in @manager
    visit admin_curriculum_behavior_examples_path(@example.behavior)

    expect { first(:xpath, '//a[text()="Delete"]').click }.to change {
      Curriculum::Example.count
    }.by(-1)
    expect(current_path).to eq(
      admin_curriculum_behavior_examples_path(@example.behavior)
    )
    expect(page).to have_content 'Example was successfully deleted'
  end

  scenario 'reorders an example', js: true do
    @other_example = create(:curriculum_example, behavior: @example.behavior)
    @third_example = create(:curriculum_example, behavior: @example.behavior)
    sign_in @manager
    visit admin_curriculum_behavior_examples_path(@example.behavior)

    find("#example-#{@example.id}").drag_to(
      find("#example-#{@third_example.id}")
    )

    expect { @example.reload.position == 3 }.to become_truthy
  end
end
