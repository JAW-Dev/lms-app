require 'rails_helper'
require 'faker'

feature 'User' do
  before :each do
    @user = create(:user)
    @user.confirm
  end

  scenario 'is not authorized view the list of user accounts' do
    sign_in @user
    visit admin_users_path

    expect(current_path).to eq(root_path)
    expect(page).to have_content 'log in or sign up'
  end

  scenario 'is not authorized view the list of companies' do
    skip 'skip companies for now'

    sign_in @user
    visit admin_companies_path

    expect(current_path).to eq(root_path)
    expect(page).to have_content 'log in or sign up'
  end
end

feature 'Manager' do
  before :each do
    @manager = create(:user)
    @manager.confirm
    @manager.add_role :manager

    @admin = create(:user)
    @admin.confirm
    @admin.add_role :manager
    @admin.add_role :admin

    @user = create(:user)
    @user.confirm
  end

  scenario 'views the list of user accounts' do
    sign_in @manager
    visit admin_users_path

    expect(page).to have_selector 'table > tbody tr', count: 3
  end

  scenario 'is not authorized to edit admins' do
    sign_in @manager
    visit edit_admin_user_path(@admin)

    expect(current_path).to eq(root_path)
    expect(page).to have_content 'log in or sign up'
  end

  scenario 'edits a user', js: true do
    sign_in @manager
    visit edit_admin_user_path(@user)

    within('form') do
      fill_in 'Last Name', with: Faker::Name.last_name
      click_button 'Update User'
    end

    expect(current_path).to eq(admin_users_path)
    expect(page).to have_content 'User was successfully updated'
  end

  scenario 'deletes a user' do
    sign_in @manager
    visit admin_users_path

    expect {
      find("[href*='#{@user.slug}'][data-method='delete']").click
    }.to change { User.count }.by(-1)
    expect(current_path).to eq(admin_users_path)
    expect(page).to have_content 'User was successfully deleted'
  end

  scenario 'assigns a user to a company', js: true do
    skip 'skip companies for now'

    company = create(:company)

    sign_in @manager
    visit edit_admin_user_path(@user)

    expect {
      within('form') do
        select company.name, from: 'user[company_id]'
        click_button 'Update User'
      end
    }.to change { @user.reload.company }.to(company)

    expect(current_path).to eq(admin_users_path)
    expect(page).to have_content 'User was successfully updated'
  end

  scenario 'sets a user as a company rep', js: true do
    skip 'skip companies for now'

    company = create(:company)

    sign_in @manager
    visit edit_admin_user_path(@user)

    expect {
      within('form') do
        select company.name, from: 'user[company_id]'
        check 'user[company_rep]'
        click_button 'Update User'
      end
    }.to change { @user.reload.company }.to(company).and change {
                                              @user
                                                .reload.has_role? :company_rep,
                                                                     company
                                            }
                                            .from(false)
                                            .to(true)

    expect(current_path).to eq(admin_users_path)
    expect(page).to have_content 'User was successfully updated'
  end

  scenario 'removes a company from a user', js: true do
    skip 'skip companies for now'

    company = create(:company)
    @user.update(company: company)
    @user.add_role :company_rep, company

    sign_in @manager
    visit edit_admin_user_path(@user)

    expect {
      within('form') do
        select '', from: 'user[company_id]'
        click_button 'Update User'
      end
    }.to change { @user.reload.company }.to(nil).and change {
                                              @user
                                                .reload.has_role? :company_rep,
                                                                     company
                                            }
                                            .from(true)
                                            .to(false)

    expect(current_path).to eq(admin_users_path)
    expect(page).to have_content 'User was successfully updated'
  end

  scenario 'invites a user', js: true do
    @course = create(:curriculum_course)

    sign_in @manager
    visit admin_users_path
    click_on 'Invite Users'

    within('form') do
      fill_in 'user_invite[user_list]', with: Faker::Internet.email
      select @course.title, from: 'user_invite[course_ids][]'
      click_button 'Send Invitations'
    end

    expect(current_path).to eq(admin_user_invites_path)
    expect(page).to have_content 'Sent invitations to 1 user.'
    expect(page).to have_selector 'table > tbody tr', count: 1
    expect(UserInvite.invited_by(@manager).count).to eq(1)
  end

  scenario 'invites multiple users', js: true do
    @course = create(:curriculum_course)

    sign_in @manager
    visit admin_users_path
    click_on 'Invite Users'

    emails = []
    5.times { emails << Faker::Internet.email }

    within('form') do
      fill_in 'user_invite[user_list]', with: emails.join("\r\n")
      select @course.title, from: 'user_invite[course_ids][]'
      click_button 'Send Invitations'
    end

    expect(current_path).to eq(admin_user_invites_path)
    expect(page).to have_content 'Sent invitations to 5 users.'
    expect(page).to have_selector 'table > tbody tr', count: 5
    expect(UserInvite.invited_by(@manager).count).to eq(5)
  end

  scenario 'invites multiple users (with bad emails)', js: true do
    @course = create(:curriculum_course)

    sign_in @manager
    visit admin_users_path
    click_on 'Invite Users'

    emails = []
    3.times { emails << Faker::Internet.email }
    2.times { emails << Faker::Internet.username }

    within('form') do
      fill_in 'user_invite[user_list]', with: emails.join("\r\n")
      select @course.title, from: 'user_invite[course_ids][]'
      click_button 'Send Invitations'
    end

    expect(current_path).to eq(admin_user_invites_path)
    expect(page).to have_content 'Sent invitations to 3 users.'
    expect(page).to have_selector 'table > tbody tr', count: 3
    expect(UserInvite.invited_by(@manager).count).to eq(3)
  end

  scenario 'deletes a user invite' do
    create(:user_invite)
    create(:user_invite)

    sign_in @manager
    visit admin_user_invites_path

    expect { first(:xpath, '//a[text()="Delete"]').click }.to change {
      UserInvite.count
    }.by(-1)
    expect(page).to have_content 'Invite was successfully deleted'
  end

  scenario 'adds users enrollments', js: true do
    @course = create(:curriculum_course)

    sign_in @manager
    visit edit_admin_user_path(@user)

    within('form') do
      click_button 'Add Invitation Access'
      select @course.title, from: 'user[user_invite_attributes][course_ids][]'
      check 'Skip sending email?'
      click_button 'Update User'
    end

    expect(@user.reload.enrolled_courses).to include(@course)
  end

  scenario 'removes users enrollments', js: true do
    @course = create(:curriculum_course)
    @course2 = create(:curriculum_course)
    @course3 = create(:curriculum_course)

    invite =
      create(:user_invite, email: @user.email, user: @user, status: :active)
    invite.courses << @course2
    invite.courses << @course3

    @user.add_role(:participant, @course)
    @user.add_role(:participant, @course2)
    @user.add_role(:participant, @course3)

    sign_in @manager
    visit edit_admin_user_path(@user)

    expect {
      within('form') do
        unselect @course2.title,
                 from: 'user[user_invite_attributes][course_ids][]'
        unselect @course3.title,
                 from: 'user[user_invite_attributes][course_ids][]'
        check 'Skip sending email?'
        click_button 'Update User'
      end
    }.to change { @user.enrolled_courses.size }.by(-1)

    expect(@user.reload.enrolled_courses).not_to include(@course3)
  end
end
