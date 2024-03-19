# == Schema Information
#
# Table name: curriculum_notes
#
#  id           :bigint(8)        not null, primary key
#  notable_type :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  notable_id   :bigint(8)
#  user_id      :bigint(8)
#

require 'rails_helper'

RSpec.describe Curriculum::Note, type: :model do
  it 'has a valid factory (behaviors)' do
    expect(create(:curriculum_note)).to be_valid
  end

  it 'has a valid factory (webinars)' do
    expect(create(:curriculum_note, :for_webinar)).to be_valid
  end
end
