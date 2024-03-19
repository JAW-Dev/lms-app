# == Schema Information
#
# Table name: curriculum_examples
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  position    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)
#

require 'rails_helper'

RSpec.describe Curriculum::Example, type: :model do
  it 'has a valid factory' do
    expect(create(:curriculum_example)).to be_valid
  end

  it 'is invalid without a description' do
    expect(build(:curriculum_example, description: nil)).to be_invalid
  end
end
