# == Schema Information
#
# Table name: addresses
#
#  id           :bigint(8)        not null, primary key
#  city         :string
#  company_name :string
#  full_name    :string
#  line1        :string
#  line2        :string
#  type         :string
#  zip          :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  country_id   :bigint(8)
#  order_id     :bigint(8)        not null
#  state_id     :bigint(8)
#

require 'rails_helper'

RSpec.describe Address, type: :model do
  it 'has a valid factory' do
    expect(create(:address)).to be_valid
  end

  # it "is invalid without an address" do
  #   expect(build(:address, line1: nil)).to be_invalid
  # end

  # it "is invalid without a city" do
  #   expect(build(:address, city: nil)).to be_invalid
  # end

  it 'sets state by abbreviation' do
    state = create(:state)
    address = create(:address, state_abbr: state.abbr)
    expect(address.state).to eq(state)
  end

  it 'sets country by alpha code' do
    country = create(:country)
    address = create(:address, country_alpha2: country.alpha2)
    expect(address.country).to eq(country)
  end
end
