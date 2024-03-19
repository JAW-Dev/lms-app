# == Schema Information
#
# Table name: curriculum_webinars
#
#  id                :bigint(8)        not null, primary key
#  audio_uuid        :string
#  description       :text
#  player_uuid       :string
#  presented_at      :datetime
#  registration_link :string
#  slug              :string
#  subtitle          :string
#  title             :string
#  video_length      :float
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

FactoryBot.define do
  factory :curriculum_webinar, class: 'Curriculum::Webinar' do
    player_uuid { Faker::Alphanumeric.alpha(number: 8) }
    title { Faker::Company.catch_phrase }
    description { Faker::Lorem.sentence }
    presented_at { DateTime.now }
    registration_link { Faker::Internet.url }
  end
end
