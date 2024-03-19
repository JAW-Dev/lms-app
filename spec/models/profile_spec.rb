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

require 'rails_helper'

RSpec.describe Profile, type: :model do
  it 'has a valid factory' do
    expect(create(:profile)).to be_valid
  end

  it 'is invalid without a first name' do
    expect(build(:profile, first_name: nil)).to be_invalid
  end

  it 'is invalid without a last name' do
    expect(build(:profile, last_name: nil)).to be_invalid
  end
end
