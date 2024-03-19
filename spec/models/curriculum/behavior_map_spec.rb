# == Schema Information
#
# Table name: curriculum_behavior_maps
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  image       :string
#  position    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)
#

require 'rails_helper'

RSpec.describe Curriculum::BehaviorMap, type: :model do
  it 'has a valid factory' do
    expect(create(:curriculum_behavior_map)).to be_valid
  end

  it 'is invalid without a description' do
    expect(build(:curriculum_behavior_map, description: nil)).to be_invalid
  end
end
