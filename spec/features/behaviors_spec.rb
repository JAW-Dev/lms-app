require 'rails_helper'
require 'faker'

feature 'User' do
  before :each do
    @user = create(:user)
    @user.confirm
    @course = create(:curriculum_course)
    @player_uuid = 'vdkLH7m8SxcLmLMVfXGfGi'
  end

  scenario 'is not authorized view the admin list of behaviors' do
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
    sign_in @user
    visit admin_curriculum_behaviors_path

    expect(current_path).to eq(root_path)
    expect(page).to have_content 'log in or sign up'
  end

  scenario 'views the list of behaviors for a purchased course' do
    @behavior1 = create(:curriculum_behavior)
    @behavior2 = create(:curriculum_behavior)
    @course.behaviors += [@behavior1, @behavior2]
    @order = create(:course_order, user: @user)
    @order.courses << @course

    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    sign_in @user
    visit curriculum_course_path(@course)

    expect(page).to have_content @course.title
    expect(page).to have_selector '.course-item.behavior', count: 2
  end

  scenario 'views a behavior for a purchased course' do
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
    @order = create(:course_order, user: @user)
    @order.courses << @course

    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    sign_in @user
    visit curriculum_course_behavior_path(@course, @behavior)

    expect(page).to have_content @behavior.title
  end

  scenario 'watches a behavior video and updates its status', js: true do
    @behavior = create(:curriculum_behavior, player_uuid: @player_uuid)
    @course.behaviors << @behavior
    @order = create(:course_order, user: @user)
    @order.courses << @course

    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    sign_in @user
    visit curriculum_course_behavior_path(@course, @behavior)

    expect {
      page.has_css?('.vidyard-player[data-ready="true"]')
    }.to become_truthy
    find('.vidyard-player-container iframe').click

    expect {
      UserBehavior.find_by(user: @user, behavior: @behavior)
    }.to become_truthy
    expect {
      UserBehavior.find_by(user: @user, behavior: @behavior).status == 'watched'
    }.to become_truthy
  end

  scenario 'watches a behavior video and updates its status', js: true do
    @behavior = create(:curriculum_behavior, player_uuid: @player_uuid)
    @course.behaviors << @behavior
    @order = create(:course_order, user: @user)
    @order.courses << @course

    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    sign_in @user
    visit curriculum_course_behavior_path(@course, @behavior)
    seek_time = @behavior.video_length - 5
    expect {
      page.has_css?('.vidyard-player[data-ready="true"]')
    }.to become_truthy
    find('.vidyard-player-container iframe').click
    page.execute_script(
      "VidyardV4.api.getPlayersByUUID('#{@behavior.player_uuid}')[0].seek(#{seek_time})"
    )

    expect {
      UserBehavior.find_by(user: @user, behavior: @behavior)
    }.to become_truthy
    expect {
      UserBehavior.find_by(user: @user, behavior: @behavior).status ==
        'completed'
    }.to become_truthy
    expect { @behavior.reload.completed?(@user) }.to become_truthy
  end

  scenario 'is not authorized to view a behavior after invite expiration' do
    @invite = create(:user_invite, :skip_validation, expires_at: 1.day.ago)
    @behavior = create(:curriculum_behavior)
    @invite.courses.first.behaviors << @behavior

    @invite_user = create(:user, email: @invite.email)
    @invite_user.confirm

    sign_in @invite_user
    visit curriculum_course_behavior_path(@course, @behavior)

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

    @course = create(:curriculum_course)
    @behavior = create(:curriculum_behavior)
    @presented_behavior = Curriculum::BehaviorPresenter.new(@behavior)
    @course.behaviors << @behavior
    @other_course = create(:curriculum_course)
  end

  scenario 'views the admin list of behaviors for an existing course',
           js: true do
    sign_in @manager
    visit admin_curriculum_course_course_behaviors_path(@course)

    expect(page).to have_xpath '(//ul[contains(@class,"striped-list")])[1]/li',
               count: 0
    expect(page).to have_xpath '(//ul[contains(@class,"striped-list")])[2]/li',
               count: 1
  end

  scenario 'views the admin list of behaviors for a new course' do
    sign_in @manager
    visit admin_curriculum_course_course_behaviors_path(@other_course)

    expect(page).to have_xpath '(//ul[contains(@class,"striped-list")])[1]/li',
               count: 1
    expect(page).to have_xpath '(//ul[contains(@class,"striped-list")])[2]/li',
               count: 0
  end

  scenario 'creates a behavior video' do
    sign_in @manager
    visit admin_curriculum_behaviors_path
    click_link 'Create a Behavior'

    expect {
      within('form') do
        fill_in 'SKU', with: "BEH#{Faker::Number.number(digits: 5)}"
        fill_in 'Title', with: Faker::Company.catch_phrase
        fill_in 'Description',
                with: Faker::Lorem.paragraphs(number: 3).join(' ')
        fill_in 'Vidyard Player UUID',
                with: Faker::Alphanumeric.alpha(number: 8)
        attach_file 'Poster Image',
                    "#{Rails.root}/spec/support/files/800x450.png"
        click_button 'Create Behavior'
      end
    }.to change { Curriculum::Behavior.count }.by(1)

    expect(current_path).to eq(admin_curriculum_behaviors_path)
    expect(
      page
    ).to have_xpath "//*[name()='img'][@src='#{@behavior.reload.poster.large.url}']"
    expect(page).to have_content 'Behavior was successfully created'
  end

  scenario 'creates a course behavior video' do
    sign_in @manager
    visit admin_curriculum_course_course_behaviors_path(@course)
    click_link 'Create a Behavior'

    expect {
      within('form') do
        fill_in 'SKU', with: "BEH#{Faker::Number.number(digits: 5)}"
        fill_in 'Title', with: Faker::Company.catch_phrase
        fill_in 'Description',
                with: Faker::Lorem.paragraphs(number: 3).join(' ')
        fill_in 'Vidyard Player UUID',
                with: Faker::Alphanumeric.alpha(number: 8)
        click_button 'Create Behavior'
      end
    }.to change { Curriculum::Behavior.count }.by(1).and change {
                                                  @course.reload.behaviors.size
                                                }.by(1)

    expect(@course.behaviors).to include
    expect(current_path).to eq(
      admin_curriculum_course_course_behaviors_path(@course)
    )
    expect(page).to have_content 'Behavior was successfully created'
  end

  scenario 'updates a behavior' do
    sign_in @manager
    visit admin_curriculum_behaviors_path
    first('table > tbody tr').click_link 'Edit'

    within('form') do
      fill_in 'Title', with: Faker::Company.catch_phrase
      click_button 'Update Behavior'
    end

    expect(current_path).to eq(admin_curriculum_behaviors_path)
    expect(page).to have_content 'Behavior was successfully updated'
  end

  scenario 'updates a behavior with no title' do
    sign_in @manager
    visit admin_curriculum_behaviors_path
    first('table > tbody tr').click_link 'Edit'

    within('form') do
      fill_in 'Title', with: ''
      click_button 'Update Behavior'
    end

    expect(page).to have_content 'Something went wrong'
  end

  scenario 'updates a behavior with no SKU' do
    sign_in @manager
    visit admin_curriculum_behaviors_path
    first('table > tbody tr').click_link 'Edit'

    within('form') do
      fill_in 'SKU', with: ''
      click_button 'Update Behavior'
    end

    expect(page).to have_content 'Something went wrong'
  end

  scenario 'updates a behavior with a duplicate SKU' do
    @behavior2 = create(:curriculum_behavior)
    @course.behaviors << @behavior2

    sign_in @manager
    visit edit_admin_curriculum_behavior_path(@behavior)

    within('form') do
      fill_in 'SKU', with: @behavior2.sku
      click_button 'Update Behavior'
    end

    expect(page).to have_content 'Something went wrong'
  end

  scenario 'deletes a behavior' do
    sign_in @manager
    visit admin_curriculum_behaviors_path

    expect { first(:xpath, '//a[text()="Delete"]').click }.to change {
      Curriculum::Behavior.count
    }.by(-1)
    expect(current_path).to eq(admin_curriculum_behaviors_path)
    expect(page).to have_content 'Behavior was successfully deleted'
  end

  scenario 'disables a behavior' do
    @other_behavior = create(:curriculum_behavior)
    @course.behaviors << @other_behavior
    sign_in @manager
    visit admin_curriculum_behaviors_path
    first('table > tbody tr').click_link 'Edit'

    expect {
      within('form') do
        uncheck 'curriculum_behavior[enabled]'
        click_button 'Update Behavior'
      end
    }.to change { Curriculum::Behavior.enabled.count }.by(-1)

    visit curriculum_course_path(@course)
    expect(page).to have_selector '.course-item.behavior', count: 1
  end
end
