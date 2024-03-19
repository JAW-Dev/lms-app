FactoryBot.define do
  factory :help_to_habit_progress do
    user { nil }
    curriculum_behavior { nil }
    progress { 1 }
    is_active { false }
  end
end
