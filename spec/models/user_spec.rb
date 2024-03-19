# == Schema Information
#
# Table name: users
#
#  id                     :bigint(8)        not null, primary key
#  access_type            :integer          default("standard_access")
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  current_sign_in_at     :datetime
#  current_sign_in_ip     :inet
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  last_sign_in_at        :datetime
#  last_sign_in_ip        :inet
#  provider               :string
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  settings               :jsonb            not null
#  sign_in_count          :integer          default(0), not null
#  sign_in_token          :string
#  sign_in_token_sent_at  :datetime
#  slug                   :string
#  uid                    :string
#  unconfirmed_email      :string
#  user_access_type       :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  company_id             :bigint(8)
#  customer_id            :string
#

require 'rails_helper'

RSpec.describe User, type: :model do
  it 'has a valid factory' do
    expect(create(:user)).to be_valid
  end

  it 'has a valid company rep factory' do
    rep = create(:company_rep)
    expect(rep).to be_valid
    expect(rep.company).to be
    expect(rep.has_role?(:company_rep, rep.company)).to be(true)
  end

  it 'is invalid without an email' do
    expect(build(:user, email: nil)).to be_invalid
  end

  it 'is invalid without a password' do
    expect(build(:user, password: nil)).to be_invalid
  end

  it 'is invalid if password confirmation does not match password' do
    random_password = Faker::Internet.password(min_length: 10)
    expect(build(:user, password_confirmation: random_password)).to be_invalid
  end

  it 'is invalid if password is less than 8 characters' do
    random_password = Faker::Internet.password(min_length: 5, max_length: 7)
    expect(build(:user, password: random_password)).to be_invalid
  end

  it 'is invalid if email is not unique' do
    email = Faker::Internet.email
    user = create(:user, email: email)
    expect(build(:user, email: email)).to be_invalid
  end

  it 'should send a confirmation email after create' do
    expect { create(:user) }.to change { ActionMailer::Base.deliveries.count }
      .by(1)
  end
end
