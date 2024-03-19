# == Schema Information
#
# Table name: gifts
#
#  id              :bigint(8)        not null, primary key
#  anonymous       :boolean          default(FALSE)
#  message         :text
#  recipient_email :string
#  recipient_name  :string
#  slug            :string
#  status          :integer          default("pending")
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  order_id        :bigint(8)        not null
#  user_id         :bigint(8)
#

FactoryBot.define do
  factory :gift do
    association :order, factory: :behavior_order
    user { nil }
    recipient_email { nil }
  end
end
