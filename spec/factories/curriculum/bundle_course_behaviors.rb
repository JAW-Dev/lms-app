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

FactoryBot.define do
  factory :curriculum_bundle_course_behavior,
          class: 'Curriculum::BundleCourseBehavior' do
    bundle_course { nil }
    behavior { nil }
    position { 1 }
  end
end
