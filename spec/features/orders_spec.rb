require 'rails_helper'
require 'faker'
require_relative '../../db/services/country_seed_service'

feature 'User' do
  before :each do
    @course = create(:curriculum_course)
    @course.behaviors << create(:curriculum_behavior)

    @user = create(:user)
    @user.confirm
  end

  scenario "cannot view other users' orders" do
    sign_in @user
    other_user = create(:user)
    order =
      create(
        :course_order,
        user: other_user,
        status: :complete,
        sold_at: DateTime.now
      )

    visit curriculum_order_path(order)

    expect(current_path).to eq(root_path)
    expect(page).to have_content 'log in or sign up'
  end

  scenario 'cannot view incomplete orders' do
    sign_in @user
    order = create(:course_order, user: @user)

    visit curriculum_order_path(order)

    expect(current_path).to eq(new_curriculum_order_path)
  end

  scenario 'views checkout form', js: true do
    @other_course = create(:curriculum_course)
    @other_course.behaviors << create(:curriculum_behavior)
    sign_in @user

    visit curriculum_courses_path
    click_link 'Learn More'
    click_link 'Purchase'

    expect(current_path).to eq(new_curriculum_order_path)
  end

  scenario 'views checkout form as a company rep', js: true do
    skip 'skip companies for now'

    @rep = create(:company_rep)
    @rep.confirm
    @other_course = create(:curriculum_course)
    @other_course.behaviors << create(:curriculum_behavior)
    sign_in @rep

    visit curriculum_courses_path
    click_link 'Learn More'
    click_link 'Purchase'

    expect(page).to have_selector 'input[name="seats"]'
  end

  scenario 'cannot have less than one course as a company rep', js: true do
    skip 'skip companies for now'

    @rep = create(:company_rep)
    @rep.confirm
    sign_in @rep

    visit new_curriculum_order_path
    fill_in 'seats', with: '0'

    expect(page).to have_content 'Error'
  end

  scenario 'purchases a course (Braintree)', js: true do
    skip 'Using Stripe'
    sign_in @user
    visit new_curriculum_order_path(@course)

    within_frame('braintree-hosted-field-number') do
      fill_in 'credit-card-number', with: '4111111111111111'
    end

    within_frame('braintree-hosted-field-cvv') { fill_in 'cvv', with: '123' }

    within_frame('braintree-hosted-field-expirationDate') do
      fill_in 'expiration', with: 1.year.from_now.strftime('%m/%y')
    end

    within_frame('braintree-hosted-field-postalCode') do
      fill_in 'postal-code', with: Faker::Address.zip_code[0..4]
    end

    mail_count = ActionMailer::Base.deliveries.count

    click_button 'Complete Purchase'

    expect {
      ActionMailer::Base.deliveries.count == mail_count + 2
    }.to become_truthy
    expect { @user.orders.last.reload.complete? }.to become_truthy
    expect { @user.reload.has_role?(:participant, @course) }.to become_truthy
    expect(current_path).to eq(curriculum_order_path(@user.orders.last))
  end

  scenario 'fails to purchase all course (Braintree)', js: true do
    skip 'Using Stripe'
    @course2 = create(:curriculum_course, price: 2001)
    sign_in @user
    visit new_curriculum_order_path(@course2)

    within_frame('braintree-hosted-field-number') do
      fill_in 'credit-card-number', with: '4111111111111111'
    end

    within_frame('braintree-hosted-field-cvv') { fill_in 'cvv', with: '123' }

    within_frame('braintree-hosted-field-expirationDate') do
      fill_in 'expiration', with: 1.year.from_now.strftime('%m/%y')
    end

    within_frame('braintree-hosted-field-postalCode') do
      fill_in 'postal-code', with: Faker::Address.zip_code[0..4]
    end

    click_button 'Complete Purchase'

    expect(page).to have_content 'Error'
    expect(page).to have_selector '.notice--alert'
  end

  scenario 'purchases all courses (Stripe)', js: true do
    skip '🤷‍♂️' if Rails.env.ci?

    CountrySeedService.add_countries
    CountrySeedService.add_states

    sign_in @user
    visit new_curriculum_order_path

    billing_name = Faker::Name.name
    company_name = Faker::Company.name
    fill_in 'full_name', with: billing_name
    fill_in 'company_name', with: company_name
    fill_in 'line1', with: Faker::Address.street_address
    fill_in 'line2', with: Faker::Address.secondary_address
    fill_in 'city', with: Faker::Address.city
    select 'United States', from: 'country_alpha2'
    select Country.find_by_alpha2('US').states.sample.name, from: 'state_abbr'
    fill_in 'zip', with: Faker::Address.zip_code[0..4]

    within_frame(find('#card-number iframe')) do
      card_number = '4242 4242 4242 4242'
      card_number.chars.each do |digit|
        find_field('cardnumber').send_keys(digit)
      end
    end

    within_frame(find('#card-cvc iframe')) { find_field('cvc').send_keys(123) }

    within_frame(find('#card-expiry iframe')) do
      find_field('exp-date').send_keys(1.year.from_now.strftime('%m/%y'))
    end

    click_button 'Complete Purchase'

    expect { @user.orders.last.reload.complete? }.to become_truthy
    expect { @user.reload.has_role?(:participant, @course) }.to become_truthy
    expect(page).to have_content(
      "Order ##{OrderPresenter.new(@user.orders.last).transaction_id.upcase}"
    )
    expect(current_path).to eq(curriculum_order_path(@user.orders.last))
    # expect(@user.orders.complete.last.billing_address.full_name).to eq(billing_name)
    # expect(@user.orders.complete.last.billing_address.company_name).to eq(company_name)
  end

  scenario 'fails to purchase all courses (Stripe)', js: true do
    skip '🤷‍♂️' if Rails.env.ci?

    CountrySeedService.add_countries
    CountrySeedService.add_states

    sign_in @user
    visit new_curriculum_order_path

    fill_in 'line1', with: Faker::Address.street_address
    fill_in 'line2', with: Faker::Address.secondary_address
    fill_in 'city', with: Faker::Address.city
    select 'United States', from: 'country_alpha2'
    select Country.find_by_alpha2('US').states.sample.name, from: 'state_abbr'
    fill_in 'zip', with: Faker::Address.zip_code[0..4]

    within_frame(find('#card-number iframe')) do
      card_number = '4000 0000 0000 9995'
      card_number.chars.each do |digit|
        find_field('cardnumber').send_keys(digit)
      end
    end

    within_frame(find('#card-cvc iframe')) { find_field('cvc').send_keys(123) }

    within_frame(find('#card-expiry iframe')) do
      find_field('exp-date').send_keys(1.year.from_now.strftime('%m/%y'))
    end

    click_button 'Complete Purchase'

    expect(page).to have_content 'Error'
    expect(page).to have_selector '.notice--alert'
  end

  scenario 'purchases a free gift (Stripe)', js: true do
    skip '🤷‍♂️' if Rails.env.ci?

    CountrySeedService.add_countries
    CountrySeedService.add_states

    behavior = @course.behaviors.first
    sign_in @user
    visit new_curriculum_order_path(course: @course, behavior: behavior)

    fill_in 'recipient_name', with: Faker::Name.first_name
    fill_in 'recipient_email', with: Faker::Internet.email

    click_button 'Send Free Gift'

    expect { @user.orders.last.reload.complete? }.to become_truthy
    expect(current_path).to eq(curriculum_order_path(@user.orders.last))
  end

  scenario 'purchases a behavior (Stripe)', js: true do
    skip '🤷‍♂️' if Rails.env.ci?

    CountrySeedService.add_countries
    CountrySeedService.add_states

    previous_order = create(:behavior_order, user: @user, status: :complete)
    behavior = @course.behaviors.first
    sign_in @user
    visit new_curriculum_order_path(course: @course, behavior: behavior)

    fill_in 'recipient_name', with: Faker::Name.first_name
    fill_in 'recipient_email', with: Faker::Internet.email

    fill_in 'line1', with: Faker::Address.street_address
    fill_in 'line2', with: Faker::Address.secondary_address
    fill_in 'city', with: Faker::Address.city
    select 'United States', from: 'country_alpha2'
    select Country.find_by_alpha2('US').states.sample.name, from: 'state_abbr'
    fill_in 'zip', with: Faker::Address.zip_code[0..4]

    within_frame(find('#card-number iframe')) do
      card_number = '4242 4242 4242 4242'
      card_number.chars.each do |digit|
        find_field('cardnumber').send_keys(digit)
      end
    end

    within_frame(find('#card-cvc iframe')) { find_field('cvc').send_keys(123) }

    within_frame(find('#card-expiry iframe')) do
      find_field('exp-date').send_keys(1.year.from_now.strftime('%m/%y'))
    end

    click_button 'Complete Purchase'

    expect { @user.orders.last.reload.complete? }.to become_truthy
    expect(page).to have_content(
      "Order ##{OrderPresenter.new(@user.orders.last).transaction_id.upcase}"
    )
    expect(current_path).to eq(curriculum_order_path(@user.orders.last))
  end

  scenario 'views order history' do
    @order = create(:course_order, user: @user)
    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    sign_in @user
    visit curriculum_orders_path

    expect(page).to have_selector 'table > tbody tr', count: 1
  end

  scenario 'views order receipt' do
    @order = create(:course_order, user: @user)
    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    sign_in @user
    visit curriculum_orders_path
    click_on 'View Receipt'

    presented_order = OrderPresenter.new(@order)
    expect(page).to have_content presented_order.transaction_id.upcase
  end

  scenario 'views seats', js: true do
    skip 'skip seats for now'

    @rep = create(:company_rep)
    @rep.confirm

    @order = create(:course_order, user: @rep, qty: 2)
    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    sign_in @rep
    visit curriculum_orders_path
    click_on 'Manage Seats'

    expect(page).to have_content 'Seats remaining: 2'
    expect(page).to have_selector '#seat-email'
  end

  scenario 'adds 1/2 seats', js: true do
    skip 'skip seats for now'

    @rep = create(:company_rep)
    @rep.confirm

    @order = create(:course_order, user: @rep, qty: 2)
    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    sign_in @rep
    visit curriculum_user_seats_path(@order)

    mail_count = ActionMailer::Base.deliveries.count

    within('form') do
      fill_in 'Email address:', with: Faker::Internet.email
      click_button 'Add User'
    end

    expect { @order.reload.user_seats.count == 1 }.to become_truthy
    expect {
      ActionMailer::Base.deliveries.count == mail_count + 1
    }.to become_truthy
    expect(page).to have_content 'Seats remaining: 1'
  end

  scenario 'adds 2/2 seats', js: true do
    skip 'skip seats for now'

    @rep = create(:company_rep)
    @rep.confirm

    @order = create(:course_order, user: @rep, qty: 2)
    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    create(:user_seat, order: @order, invited_at: DateTime.now)

    sign_in @rep
    visit curriculum_user_seats_path(@order)

    mail_count = ActionMailer::Base.deliveries.count

    within('form') do
      fill_in 'Email address:', with: Faker::Internet.email
      click_button 'Add User'
    end

    expect { @order.reload.user_seats.count == 2 }.to become_truthy
    expect {
      ActionMailer::Base.deliveries.count == mail_count + 1
    }.to become_truthy
    expect(page).to have_content 'Seats remaining: 0'
  end

  scenario 'fails to add existing email address to new seat', js: true do
    skip 'skip seats for now'

    @rep = create(:company_rep)
    @rep.confirm

    @order = create(:course_order, user: @rep, qty: 2)
    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    seat = create(:user_seat, order: @order, invited_at: DateTime.now)

    sign_in @rep
    visit curriculum_user_seats_path(@order)

    within('form') do
      fill_in 'Email address:', with: seat.email
      click_button 'Add User'
    end

    expect(page).to have_content 'Email has already been taken'
    expect(page).to have_content 'Seats remaining: 1'
  end
end
