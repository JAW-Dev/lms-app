# == Schema Information
#
# Table name: curriculum_bundle_courses
#
#  id         :bigint(8)        not null, primary key
#  position   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  bundle_id  :bigint(8)        not null
#  course_id  :bigint(8)        not null
#

class Curriculum::BundleCourse < ApplicationRecord
  acts_as_list

  belongs_to :bundle
  belongs_to :course

  has_many :bundle_course_behaviors, dependent: :destroy
  has_many :behaviors, through: :bundle_course_behaviors
end
