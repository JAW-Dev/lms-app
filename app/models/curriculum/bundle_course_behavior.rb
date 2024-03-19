# == Schema Information
#
# Table name: curriculum_bundle_course_behaviors
#
#  id               :bigint(8)        not null, primary key
#  position         :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  behavior_id      :bigint(8)        not null
#  bundle_course_id :bigint(8)        not null
#

class Curriculum::BundleCourseBehavior < ApplicationRecord
  acts_as_list

  belongs_to :bundle_course
  belongs_to :behavior
end
