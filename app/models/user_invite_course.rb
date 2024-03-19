# == Schema Information
#
# Table name: user_invite_courses
#
#  id             :bigint(8)        not null, primary key
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  course_id      :bigint(8)        not null
#  user_invite_id :bigint(8)        not null
#

class UserInviteCourse < ApplicationRecord
  belongs_to :user_invite
  belongs_to :course, class_name: 'Curriculum::Course'
end
