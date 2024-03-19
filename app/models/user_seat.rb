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

class UserSeat < ApplicationRecord
  enum status: { pending: 0, active: 1 }

  belongs_to :user, optional: true
  belongs_to :order

  validates :email, uniqueness: { scope: :order_id }
  validate :seats_cannot_exceed_order_qty, on: :create

  before_save :downcase_email
  before_save :send_invitation

  def seats_cannot_exceed_order_qty
    if UserSeat.where(order: order).count == order.qty
      errors.add(:invitations, 'cannot exceed number of seats ordered')
    end
  end

  def downcase_email
    self.email.downcase!
  end

  def send_invitation
    Messenger.seat_invitation(self).deliver_now if invited_at_changed?
  end
end
