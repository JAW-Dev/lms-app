# == Schema Information
#
# Table name: curriculum_courses
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  enabled     :boolean          default(FALSE)
#  options     :jsonb
#  position    :integer
#  poster      :string
#  sku         :string
#  slug        :string
#  title       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

FactoryBot.define do
  factory :curriculum_course, class: 'Curriculum::Course' do
    enabled { true }
    title { Faker::Company.catch_phrase }
    sku { "MOD#{Faker::Number.number(digits: 5)}" }
    description { Faker::Lorem.paragraphs(number: 3).join(' ') }
    poster do
      Rack::Test::UploadedFile.new(
        File.open("#{Rails.root}/spec/support/files/800x450.png")
      )
    end
    position { nil }
  end
end
