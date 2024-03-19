# == Schema Information
#
# Table name: states
#
#  id         :bigint(8)        not null, primary key
#  abbr       :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  country_id :bigint(8)
#

require 'rails_helper'

RSpec.describe State, type: :model do
  it 'has a valid factory' do
    expect(create(:state)).to be_valid
  end

  it 'is invalid without a name' do
    expect(build(:state, name: nil)).to be_invalid
  end

  it 'is invalid without a two-letter abbreviation' do
    expect(build(:state, abbr: nil)).to be_invalid
  end

  it 'is invalid if the abbreviation is not two letters' do
    expect(build(:state, abbr: 'SUP')).to be_invalid
  end
end
