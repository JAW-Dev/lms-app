require 'rails_helper'
require 'faker'

feature 'User' do
  before :each do
    @user = build(:user)
    @profile = build(:profile, user: @user)
    @password = Faker::Internet.password(max_length: 10)
  end

  scenario 'visits sign up page' do
    visit root_path
    click_link 'Sign Up'

    expect(page).to have_selector 'form#new_user'
  end

  scenario 'registers with valid email and password' do
    visit new_user_registration_path

    expect {
      within('#new_user') do
        fill_in 'Email', with: @user.email
        fill_in 'Password', with: @password, match: :prefer_exact
        fill_in 'Confirm password', with: @password, match: :prefer_exact
        fill_in 'First name', with: @profile.first_name
        fill_in 'Last name', with: @profile.last_name
        click_button 'Sign Up'
      end
    }.to change { User.count }.by(1)

    expect(page).to have_content 'confirmation'
  end

  scenario 'registers with an email that is already taken' do
    @existing_user = create(:user)

    visit new_user_registration_path

    expect {
      within('#new_user') do
        fill_in 'First name', with: @profile.first_name
        fill_in 'Last name', with: @profile.last_name
        fill_in 'Email', with: @existing_user.email
        fill_in 'Password', with: @password, match: :prefer_exact
        fill_in 'Confirm password', with: @password, match: :prefer_exact
        click_button 'Sign Up'
      end
    }.to_not change { User.count }

    expect(page).to have_content 'errors'
  end

  scenario 'registers with non-matching passwords' do
    visit new_user_registration_path

    expect {
      within('#new_user') do
        fill_in 'Email', with: @user.email
        fill_in 'Password', with: @password, match: :prefer_exact
        fill_in 'Confirm password',
                with: Faker::Internet.password(max_length: 10),
                match: :prefer_exact
        fill_in 'First name', with: @profile.first_name
        fill_in 'Last name', with: @profile.last_name
        click_button 'Sign Up'
      end
    }.to_not change { User.count }

    expect(page).to have_content 'errors'
  end

  scenario 'registers with existing seat' do
    skip 'skip seats for now'

    rep = create(:company_rep)
    order = create(:course_order, user: rep, status: :complete)
    course = order.courses.first
    seat = create(:user_seat, order: order)
    password = Faker::Internet.password(max_length: 10)
    visit new_user_registration_path

    expect {
      within('#new_user') do
        fill_in 'Email', with: seat.email
        fill_in 'Password', with: password, match: :prefer_exact
        fill_in 'Confirm password', with: password, match: :prefer_exact
        fill_in 'First name', with: Faker::Name.first_name
        fill_in 'Last name', with: Faker::Name.last_name
        click_button 'Sign Up'
      end
    }.to change { seat.reload.status }.to('active')

    expect(page).to have_content 'Welcome!'
    expect { seat.reload.user }.to become_truthy
    expect { seat.reload.user.company == rep.company }.to become_truthy
    expect { seat.reload.user.enrolled_in?(course) }.to become_truthy
  end

  scenario 'registers with existing invitation' do
    valid_for_days = 14
    user_invite = create(:user_invite, valid_for_days: valid_for_days)
    password = Faker::Internet.password(max_length: 10)
    visit new_user_registration_path

    expect {
      within('#new_user') do
        fill_in 'Email', with: user_invite.email
        fill_in 'Password', with: password, match: :prefer_exact
        fill_in 'Confirm password', with: password, match: :prefer_exact
        fill_in 'First name', with: Faker::Name.first_name
        fill_in 'Last name', with: Faker::Name.last_name
        click_button 'Sign Up'
      end
    }.to change { user_invite.reload.status }.to('active')

    expect(page).to have_content 'Welcome!'
    expect {
      user_invite.reload.user.enrolled_in?(user_invite.courses.first)
    }.to become_truthy
    expect(
      user_invite.expires_at - (user_invite.updated_at + valid_for_days.days)
    ).to be < 1.minute
  end
end
