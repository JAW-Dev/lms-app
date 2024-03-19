class UserHabit < ApplicationRecord
  belongs_to :user
  belongs_to :curriculum_behavior_map, class_name: 'Curriculum::BehaviorMap'
end

