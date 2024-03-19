# == Schema Information
#
# Table name: countries
#
#  id         :bigint(8)        not null, primary key
#  alpha2     :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe Country, type: :model do
  it 'has a valid factory' do
    expect(create(:country)).to be_valid
  end

  it 'is invalid without a name' do
    expect(build(:country, name: nil)).to be_invalid
  end

  it 'is invalid without a two-letter abbreviation' do
    expect(build(:country, alpha2: nil)).to be_invalid
  end

  it 'is invalid if the abbreviation is not two letters' do
    expect(build(:country, alpha2: 'SUP')).to be_invalid
  end
end
