require 'rails_helper'
require 'faker'

feature 'Gift' do
  scenario 'new user redeems a gift' do
    user = build(:user)
    profile = build(:profile, user: user)
    password = Faker::Internet.password(max_length: 10)
    gift = create(:gift, recipient_email: Faker::Internet.email)
    course = gift.order.courses.first
    behavior = gift.order.behaviors.first

    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(gift.order)

    visit new_user_access_path(user_type: :gift, g: gift.slug)

    new_user = User.last
    expect { new_user.has_role?(:participant, behavior) }.to become_truthy
    expect {
      new_user.has_role?(:participant, course.behaviors.first)
    }.to become_truthy
  end

  scenario 'existing user redeems a gift' do
    @user = create(:user)
    @user.confirm
    gift = create(:gift, recipient_email: Faker::Internet.email)
    course = gift.order.courses.first
    behavior = gift.order.behaviors.first

    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(gift.order)

    visit new_user_session_path(g: gift.slug)

    within('form') do
      fill_in 'user[email]', with: @user.email
      click_button 'Continue'
      fill_in 'user[password]', with: @user.password
      click_button 'Continue'
    end

    expect { @user.reload.has_role?(:participant, behavior) }.to become_truthy
    expect {
      @user.reload.has_role?(:participant, course.behaviors.first)
    }.to become_truthy
  end
end
