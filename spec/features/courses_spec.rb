require 'rails_helper'
require 'faker'

feature 'User' do
  before :each do
    @user = create(:user)
    @user.confirm
  end

  scenario 'is not authorized view the admin list of courses' do
    sign_in @user
    visit admin_curriculum_courses_path

    expect(current_path).to eq(root_path)
    expect(page).to have_content 'log in or sign up'
  end

  scenario 'views the list of courses' do
    @course = create(:curriculum_course)
    @course2 = create(:curriculum_course)

    visit curriculum_courses_path

    expect(page).to have_selector '.course-item', count: 2
  end
end

feature 'Admin' do
  before :each do
    @course = create(:curriculum_course)

    @manager = create(:user)
    @manager.confirm
    @manager.add_role :manager
    @manager.add_role :admin
  end

  scenario 'views the admin list of courses' do
    sign_in @manager
    visit admin_curriculum_courses_path

    expect(page).to have_selector 'table > tbody tr', count: 1
  end

  scenario 'creates a course' do
    sign_in @manager
    visit admin_curriculum_courses_path
    click_link 'Create a Module'

    expect {
      within('form') do
        fill_in 'SKU', with: "MOD#{Faker::Number.number(digits: 5)}"
        fill_in 'Title', with: Faker::Company.catch_phrase
        fill_in 'Description',
                with: Faker::Lorem.paragraphs(number: 3).join(' ')
        attach_file 'Poster Image',
                    "#{Rails.root}/spec/support/files/800x450.png"
        click_button 'Create Module'
      end
    }.to change { Curriculum::Course.count }.by(1)

    expect(current_path).to eq(admin_curriculum_courses_path)
    expect(
      page
    ).to have_xpath "//*[name()='img'][@src='#{@course.reload.poster.large.url}']"
    expect(page).to have_content 'Module was successfully created'
  end

  scenario 'updates a course' do
    sign_in @manager
    visit admin_curriculum_courses_path
    click_link 'Edit'

    within('form') do
      fill_in 'Title', with: Faker::Company.catch_phrase
      click_button 'Update Module'
    end

    expect(current_path).to eq(admin_curriculum_courses_path)
    expect(page).to have_content 'Module was successfully updated'
  end

  scenario 'updates a course with no title' do
    sign_in @manager
    visit admin_curriculum_courses_path
    click_link 'Edit'

    within('form') do
      fill_in 'Title', with: ''
      click_button 'Update Module'
    end

    expect(page).to have_content 'Something went wrong'
  end

  scenario 'updates a course with no SKU' do
    sign_in @manager
    visit admin_curriculum_courses_path
    click_link 'Edit'

    within('form') do
      fill_in 'SKU', with: ''
      click_button 'Update Module'
    end

    expect(page).to have_content 'Something went wrong'
  end

  scenario 'deletes a course' do
    sign_in @manager
    visit admin_curriculum_courses_path

    expect { first(:xpath, '//a[text()="Delete"]').click }.to change {
      Curriculum::Course.count
    }.by(-1)
    expect(current_path).to eq(admin_curriculum_courses_path)
    expect(page).to have_content 'Module was successfully deleted'
  end

  scenario 'reorders a course', js: true do
    @other_course = create(:curriculum_course)
    @third_course = create(:curriculum_course)
    sign_in @manager
    visit admin_curriculum_courses_path

    find("#course-#{@course.id}").drag_to(find("#course-#{@third_course.id}"))

    expect { @course.reload.position == 3 }.to become_truthy
  end

  scenario 'views behaviors for a course', js: true do
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
    sign_in @manager
    visit admin_curriculum_courses_path
    click_link 'Manage Behaviors'

    expect(current_path).to eq(
      admin_curriculum_course_course_behaviors_path(@course)
    )
    expect(page).to have_xpath '(//ul[contains(@class,"striped-list")])[2]/li',
               count: 1
  end

  scenario 'disables a course' do
    @other_course = create(:curriculum_course)
    sign_in @manager
    visit admin_curriculum_courses_path
    first('table > tbody tr').click_link 'Edit'

    expect {
      within('form') do
        uncheck 'curriculum_course[enabled]'
        click_button 'Update Module'
      end
    }.to change { Curriculum::Course.enabled.count }.by(-1)

    visit curriculum_courses_path
    expect(page).to have_selector '.course-item', count: 1
  end
end
