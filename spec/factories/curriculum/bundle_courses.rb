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

FactoryBot.define do
  factory :curriculum_bundle_course, class: 'Curriculum::BundleCourse' do
    association :bundle, factory: :curriculum_bundle
    association :course, factory: :curriculum_course
  end
end
