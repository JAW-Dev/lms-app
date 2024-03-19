# == Schema Information
#
# Table name: order_courses
#
#  id         :bigint(8)        not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  course_id  :bigint(8)        not null
#  order_id   :bigint(8)        not null
#

FactoryBot.define do
  factory :order_course do
    order { nil }
    course { nil }
  end
end
