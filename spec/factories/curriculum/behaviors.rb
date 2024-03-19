# == Schema Information
#
# Table name: curriculum_behaviors
#
#  id             :bigint(8)        not null, primary key
#  audio_uuid     :string
#  description    :text
#  enabled        :boolean          default(FALSE)
#  example_image  :string
#  exercise_image :string
#  player_uuid    :string
#  poster         :string
#  price_cents    :integer          default(0), not null
#  price_currency :string           default("USD"), not null
#  sku            :string
#  slug           :string
#  subtitle       :string
#  title          :string
#  video_length   :float            default(0.0)
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

FactoryBot.define do
  factory :curriculum_behavior, class: 'Curriculum::Behavior' do
    enabled { true }
    player_uuid { Faker::Alphanumeric.alpha(number: 8) }
    title { Faker::Company.catch_phrase }
    sku { Faker::Alphanumeric.alphanumeric(number: 10).upcase }
    description { Faker::Lorem.paragraphs(number: 3).join(' ') }
    poster do
      Rack::Test::UploadedFile.new(
        File.open("#{Rails.root}/spec/support/files/800x450.png")
      )
    end
    price { 25.0 }
  end
end
