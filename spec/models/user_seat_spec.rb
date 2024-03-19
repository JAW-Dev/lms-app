# == Schema Information
#
# Table name: user_seats
#
#  id         :bigint(8)        not null, primary key
#  email      :string
#  invited_at :datetime
#  status     :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  order_id   :bigint(8)
#  user_id    :bigint(8)
#

require 'rails_helper'

RSpec.describe UserSeat, type: :model do
  it 'has a valid factory' do
    expect(create(:user_seat)).to be_valid
  end

  it 'can only have unique emails for each order' do
    order = create(:course_order, qty: 2)
    seat = create(:user_seat, order: order)
    expect(build(:user_seat, email: seat.email, order: order)).to be_invalid
  end

  it 'cannot exceed the order quantity' do
    order = create(:course_order, qty: 2)
    create(:user_seat, order: order)
    create(:user_seat, order: order)
    expect(build(:user_seat, order: order)).to be_invalid
  end
end
