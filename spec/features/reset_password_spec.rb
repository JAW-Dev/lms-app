require 'rails_helper'
require 'faker'

feature 'User' do
  before :each do
    @user = create(:user)
    @user.confirm
  end

  scenario 'visits the password reset page' do
    visit root_path

    click_link 'Log In'
    click_link 'Need to set or reset your password?'

    expect(page).to have_selector 'form#new_user'
  end

  scenario 'submits forgot password form' do
    visit new_user_password_path

    expect {
      within('#new_user') do
        fill_in 'Email', with: @user.email
        click_button 'Send instructions'
      end
    }.to change { ActionMailer::Base.deliveries.count }.by(1)
  end

  scenario 'submits password reset form' do
    token = @user.send_reset_password_instructions
    password = Faker::Internet.password(max_length: 10)

    visit edit_user_password_path(reset_password_token: token)

    within('#new_user') do
      fill_in 'New password', with: password
      fill_in 'Confirm your new password', with: password
      click_button 'Change password'
    end

    expect(page).to have_content 'Your password has been reset'
  end
end
