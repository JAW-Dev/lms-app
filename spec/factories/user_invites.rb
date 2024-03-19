# == Schema Information
#
# Table name: user_invites
#
#  id               :bigint(8)        not null, primary key
#  access_type      :integer          default("limited")
#  discount_cents   :integer          default(0), not null
#  email            :string
#  expires_at       :datetime
#  invited_at       :datetime
#  message          :text
#  name             :string
#  status           :integer          default("pending")
#  unlimited_gifts  :boolean
#  user_access_type :string
#  valid_for_days   :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  invited_by_id    :bigint(8)
#  user_id          :bigint(8)
#

FactoryBot.define do
  trait :skip_validation do
    to_create { |instance| instance.save(validate: false) }
  end

  factory :user_invite do
    status { :pending }
    email { Faker::Internet.email }
    invited_at { DateTime.now }
    user { nil }

    before :create do |invite|
      invite.courses << create(:curriculum_course)
    end
  end
end
