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

FactoryBot.define do
  factory :user_invite_course do
    user_invite
    association :course, factory: :curriculum_course
  end
end
