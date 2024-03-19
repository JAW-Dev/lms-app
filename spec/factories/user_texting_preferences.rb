FactoryBot.define do
  factory :user_texting_preference do
    user { nil }
    enabled { false }
    time_of_day { "MyString" }
  end
end
