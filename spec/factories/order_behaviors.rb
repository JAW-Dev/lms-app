# == Schema Information
#
# Table name: order_behaviors
#
#  id          :bigint(8)        not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)        not null
#  order_id    :bigint(8)        not null
#

FactoryBot.define do
  factory :order_behavior do
    order { nil }
    behavior { nil }
  end
end
