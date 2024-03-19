require 'rails_helper'
require 'faker'

feature 'User' do
  before :each do
    @user = create(:user)
    @user.confirm
    @profile = @user.profile
    @profile_presenter = ProfilePresenter.new(@profile)
  end

  scenario 'visits their profile page' do
    sign_in @user
    visit root_path
    click_button @profile_presenter.full_name
    click_link 'Account'

    expect(page).to have_content 'Account Details'
    expect(page).to have_selector 'form'
  end

  scenario 'updates their profile' do
    sign_in @user
    visit user_profile_path

    within('form#profile-form') do
      fill_in 'First name', with: Faker::Name.first_name
      fill_in 'Last name', with: Faker::Name.last_name
      attach_file 'Profile picture',
                  "#{Rails.root}/spec/support/files/800x450.png"
      click_button 'Update Profile'
    end

    expect(
      page
    ).to have_xpath "//*[@class='main-nav__avatar']/*[name()='image'][@href='#{@profile.avatar.thumb.url}']"
    expect(page).to have_content 'Your information was updated successfully'
  end

  scenario 'removes their profile picture' do
    sign_in @user
    visit user_profile_path

    expect {
      within('form#profile-form') do
        check 'Remove profile picture'
        click_button 'Update Profile'
      end
    }.to change { @profile.reload.avatar.file }.to(nil)

    expect(
      page
    ).to have_xpath "//*[@class='main-nav__avatar']/*[name()='text'][text()='#{@profile_presenter.initials}']"
    expect(page).to have_content 'Your information was updated successfully'
  end
end
