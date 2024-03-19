json.extract! @behavior, :id, :title, :h2h_status
json.h2h_intro @behavior.h2h_intro
json.h2h_outro @behavior.h2h_outro
json.help_to_habits @behavior.help_to_habits.order(order: :asc) do |habit|
  json.id habit.id
  json.curriculum_behavior_id habit.curriculum_behavior_id
  json.order habit.order
  json.content habit.content
end
