# == Schema Information
#
# Table name: companies
#
#  id         :bigint(8)        not null, primary key
#  city       :string
#  line_one   :string
#  line_two   :string
#  name       :string
#  phone      :string
#  slug       :string
#  zip        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  country_id :bigint(8)
#  state_id   :bigint(8)
#

require 'rails_helper'

RSpec.describe Company, type: :model do
  it 'has a valid factory' do
    expect(create(:company)).to be_valid
  end

  it 'is invalid without a name' do
    expect(build(:company, name: nil)).to be_invalid
  end

  it 'is invalid without an address' do
    expect(build(:company, line_one: nil)).to be_invalid
  end

  it 'is invalid without a city' do
    expect(build(:company, city: nil)).to be_invalid
  end
end
