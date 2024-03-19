# == Schema Information
#
# Table name: gifts
#
#              :id => :integer,
#          :status => :integer,
#        :order_id => :integer,
# :recipient_email => :string,
#         :user_id => :integer,
#            :slug => :string,
#      :created_at => :datetime,
#      :updated_at => :datetime,
#       :anonymous => :boolean,
#  :recipient_name => :string,
#         :message => :text,
#      :expires_at => :datetime,
#  :valid_for_days => :integer,
#     :expiry_type => :string
#

class Gift < ApplicationRecord
  extend FriendlyId
  friendly_id :uuid, use: :slugged

  enum status: { pending: 0, redeemed: 1 }

  belongs_to :user, optional: true
  belongs_to :order, class_name: 'BehaviorOrder'

  before_save :downcase_recipient_email, if: :recipient_email

  EXPIRY_TYPES = ['limited', 'unlimited'].freeze

  validates :expiry_type, inclusion: { in: EXPIRY_TYPES }

  def downcase_recipient_email
    self.recipient_email.downcase!
  end

  def uuid
    SecureRandom.uuid
  end

  def behavior
    self.order.behaviors.first
  end

  def expired?
    return false if self.expires_at.blank?
    date_time = self.expires_at.to_datetime
    date_time < DateTime.now
  end
end
