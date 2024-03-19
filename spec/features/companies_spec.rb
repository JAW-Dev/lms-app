require 'rails_helper'
require 'faker'

feature 'User' do
  before :each do
    @user = create(:user)
    @user.confirm
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

    @company = create(:company)
  end

  scenario 'views the list of companies' do
    skip 'skip companies for now'

    sign_in @manager
    visit admin_companies_path

    expect(page).to have_selector 'table > tbody tr', count: 1
  end

  scenario 'creates a company' do
    skip 'skip companies for now'

    sign_in @manager
    visit admin_companies_path
    click_link 'Create a Company'

    expect {
      within('form') do
        fill_in 'Name', with: Faker::Company.name
        fill_in 'company[line_one]', with: Faker::Address.street_address
        fill_in 'company[line_one]', with: Faker::Address.secondary_address
        fill_in 'City', with: Faker::Address.city
        select @company.state.name, from: 'company[state_id]'
        fill_in 'Zip', with: Faker::Address.zip
        fill_in 'Phone', with: Faker::PhoneNumber.phone_number
        select @company.state.country.name, from: 'company[country_id]'
        click_button 'Create Company'
      end
    }.to change { Company.count }.by(1)

    expect(current_path).to eq(admin_companies_path)
    expect(page).to have_content 'Company was successfully created'
  end

  scenario 'updates a company' do
    skip 'skip companies for now'

    sign_in @manager
    visit admin_companies_path
    click_link 'Edit'

    within('form') do
      fill_in 'Phone', with: Faker::PhoneNumber.phone_number
      click_button 'Update Company'
    end

    expect(current_path).to eq(admin_companies_path)
    expect(page).to have_content 'Company was successfully updated'
  end

  scenario 'updates a company with no name' do
    skip 'skip companies for now'

    sign_in @manager
    visit admin_companies_path
    click_link 'Edit'

    within('form') do
      fill_in 'Name', with: ''
      click_button 'Update Company'
    end

    expect(page).to have_content 'Something went wrong'
  end

  scenario 'deletes a company' do
    skip 'skip companies for now'

    sign_in @manager
    visit admin_companies_path

    expect { first(:xpath, '//a[text()="Delete"]').click }.to change {
      Company.count
    }.by(-1)
    expect(current_path).to eq(admin_companies_path)
    expect(page).to have_content 'Company was successfully deleted'
  end
end

feature 'Company Rep' do
  skip 'skip companies for now'

  before :each do
    @rep = create(:company_rep)
    @rep.confirm
  end

  scenario 'views related company' do
    skip 'skip companies for now'

    sign_in @rep
    visit edit_admin_company_path(@rep.company)

    expect(page).to have_content @rep.company.name
  end

  scenario 'is not authorized to view an unrelated company' do
    skip 'skip companies for now'

    @company = create(:company)
    sign_in @rep
    visit edit_admin_company_path(@company)

    expect(page).to have_content 'log in or sign up'
  end

  scenario 'views company users' do
    skip 'skip companies for now'

    @user = create(:user)
    @user.confirm
    @user.update(company: @rep.company)
    sign_in @rep
    visit users_admin_company_path(@rep.company)

    expect(page).to have_selector 'table > tbody tr', count: 2
  end

  scenario 'is not authorized to view users from another company' do
    skip 'skip companies for now'

    @company = create(:company)
    sign_in @rep
    visit users_admin_company_path(@company)

    expect(page).to have_content 'log in or sign up'
  end

  scenario 'views company user' do
    skip 'skip companies for now'

    @user = create(:user)
    @user.confirm
    @user.update(company: @rep.company)
    sign_in @rep
    visit admin_user_path(@user)

    expect(page).to have_content "Email: #{@user.email}"
  end

  scenario 'is not authorized to view a user from another company' do
    skip 'skip companies for now'

    @user = create(:user)
    @user.confirm
    sign_in @rep
    visit admin_user_path(@user)

    expect(page).to have_content 'log in or sign up'
  end
end
