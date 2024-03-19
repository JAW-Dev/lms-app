# == Schema Information
#
# Table name: curriculum_course_behaviors
#
#  id          :bigint(8)        not null, primary key
#  position    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)        not null
#  course_id   :bigint(8)        not null
#

class Curriculum::CourseBehavior < ApplicationRecord
  belongs_to :course
  belongs_to :behavior

  acts_as_list scope: :course
end
