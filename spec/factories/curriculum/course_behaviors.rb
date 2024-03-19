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

FactoryBot.define do
  factory :curriculum_course_behavior, class: 'Curriculum::CourseBehavior' do
    association :course, factory: :curriculum_course
    association :behavior, factory: :curriculum_behavior
    position { nil }
  end
end
