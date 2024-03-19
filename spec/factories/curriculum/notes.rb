# == Schema Information
#
# Table name: curriculum_notes
#
#  id           :bigint(8)        not null, primary key
#  notable_type :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  notable_id   :bigint(8)
#  user_id      :bigint(8)
#

FactoryBot.define do
  factory :curriculum_note, class: 'Curriculum::Note' do
    for_behavior
    user
    content { Faker::Lorem.paragraphs(number: 3).join(' ') }

    trait :for_behavior do
      association :notable, factory: :curriculum_behavior
    end

    trait :for_webinar do
      association :notable, factory: :curriculum_webinar
    end
  end
end
