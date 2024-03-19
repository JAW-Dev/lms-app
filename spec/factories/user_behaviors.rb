# == Schema Information
#
# Table name: user_behaviors
#
#  id          :bigint(8)        not null, primary key
#  status      :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)
#  user_id     :bigint(8)
#

FactoryBot.define do
  factory :user_behavior do
    user
    association :behavior, factory: :curriculum_behavior
    status { nil }
  end
end
