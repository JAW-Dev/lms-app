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

require 'rails_helper'

RSpec.describe Curriculum::Webinar, type: :model do
  it 'has a valid factory' do
    expect(create(:curriculum_webinar)).to be_valid
  end

  it 'is invalid without a title' do
    expect(build(:curriculum_webinar, title: nil)).to be_invalid
  end

  it 'is invalid without a date' do
    expect(build(:curriculum_webinar, presented_at: nil)).to be_invalid
  end
end
