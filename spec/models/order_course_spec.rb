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

require 'rails_helper'

RSpec.describe OrderCourse, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
