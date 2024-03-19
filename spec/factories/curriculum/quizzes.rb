# == Schema Information
#
# Table name: curriculum_quizzes
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  course_id   :bigint(8)        not null
#

FactoryBot.define do
  factory :curriculum_quiz, class: 'Curriculum::Quiz' do
    association :course, factory: :curriculum_course
    description { Faker::Lorem.paragraph }
  end
end
