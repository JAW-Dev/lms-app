# == Schema Information
#
# Table name: user_invites
#
#  id               :bigint(8)        not null, primary key
#  access_type      :integer          default("limited")
#  discount_cents   :integer          default(0), not null
#  email            :string
#  expires_at       :datetime
#  invited_at       :datetime
#  message          :text
#  name             :string
#  status           :integer          default("pending")
#  unlimited_gifts  :boolean
#  user_access_type :string
#  valid_for_days   :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  invited_by_id    :bigint(8)
#  user_id          :bigint(8)
#

require 'rails_helper'

RSpec.describe UserInvite, type: :model do
  it 'has a valid factory' do
    expect(create(:user_invite)).to be_valid
  end

  it 'must have a unique email' do
    invite = create(:user_invite)
    expect(build(:user_invite, email: invite.email)).to be_invalid
  end

  it 'must have an expiration date in the future' do
    expect(build(:user_invite, expires_at: 1.week.ago)).to be_invalid
  end
end
