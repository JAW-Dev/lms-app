# == Schema Information
#
# Table name: user_behaviors
#
#  id          :bigint(8)        not null, primary key
#  status      :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)
#  user_id     :bigint(8)
#

require 'rails_helper'

RSpec.describe UserBehavior, type: :model do
  it 'has a valid factory' do
    expect(create(:user_behavior)).to be_valid
  end
end
