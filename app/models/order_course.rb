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

class OrderCourse < ApplicationRecord
  belongs_to :order
  belongs_to :course, class_name: 'Curriculum::Course'
end
