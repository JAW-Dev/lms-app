require 'rails_helper'
require 'faker'

feature 'User' do
  before :each do
    @user = create(:user)
    @user.confirm
  end

  scenario 'visits login page' do
    visit root_path
    click_link 'Log In'

    expect(page).to have_selector 'form#new_user'
  end

  scenario 'logs in with valid email and password' do
    visit new_user_session_path

    within('#new_user') do
      fill_in 'Email', with: @user.email
      click_button 'Continue'
      fill_in 'Password', with: @user.password
      click_button 'Continue'
    end

    expect(page).to have_content 'Signed in successfully'
  end

  scenario 'logs in with invalid email and password' do
    visit new_user_session_path

    within('#new_user') do
      fill_in 'Email', with: @user.email
      click_button 'Continue'
      fill_in 'Password', with: Faker::Internet.password(max_length: 10)
      click_button 'Continue'
    end

    expect(page).to have_content 'Invalid'
  end
end
