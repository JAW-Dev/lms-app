# == Schema Information
#
# Table name: profiles
#
#  id           :bigint(8)        not null, primary key
#  avatar       :string
#  company_name :string
#  first_name   :string
#  hubspot      :jsonb
#  last_name    :string
#  opt_in       :boolean          default(FALSE)
#  phone        :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint(8)
#

FactoryBot.define do
  factory :profile do
    user
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    avatar do
      Rack::Test::UploadedFile.new(
        File.open("#{Rails.root}/spec/support/files/800x450.png")
      )
    end
  end
end
