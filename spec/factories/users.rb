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

FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    password { Faker::Internet.password(min_length: 10) }
    profile_attributes { attributes_for(:profile) }

    factory :company_rep do
      after(:create) do |user|
        company = create(:company)
        user.update(company: company)
        user.add_role(:company_rep, company)
      end
    end
  end
end
