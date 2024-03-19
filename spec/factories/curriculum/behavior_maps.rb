# == Schema Information
#
# Table name: curriculum_behavior_maps
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  image       :string
#  position    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)
#

FactoryBot.define do
  factory :curriculum_behavior_map, class: 'Curriculum::BehaviorMap' do
    association :behavior, factory: :curriculum_behavior
    description { Faker::Lorem.paragraph }
    image { nil }
    position { nil }
  end
end
