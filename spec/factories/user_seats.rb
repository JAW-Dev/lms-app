# == Schema Information
#
# Table name: user_seats
#
#  id         :bigint(8)        not null, primary key
#  email      :string
#  invited_at :datetime
#  status     :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  order_id   :bigint(8)
#  user_id    :bigint(8)
#

FactoryBot.define do
  factory :user_seat do
    user { nil }
    order
    email { Faker::Internet.email }
    status { :pending }
  end
end
