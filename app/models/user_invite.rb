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

class UserInvite < ApplicationRecord
  attr_accessor :user_list, :skip_email
  enum status: { pending: 0, active: 1 }
  enum access_type: { limited: 0, unlimited: 1 }

  include PgSearch::Model
  pg_search_scope :search_for,
                  against: :email,
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }

  scope :sort_by_email_address_asc, -> { order('LOWER(email) ASC') }
  scope :sort_by_email_address_desc, -> { order('LOWER(email) DESC') }

  scope :sort_by_domain_asc,
        -> { order("split_part(LOWER(email), '@', 2) ASC") }
  scope :sort_by_domain_desc,
        -> { order("split_part(LOWER(email), '@', 2) DESC") }

  scope :invited_by, ->(user = nil) { where(invited_by: user) if user }

  monetize :discount_cents

  belongs_to :user, optional: true
  belongs_to :invited_by,
             foreign_key: :invited_by_id,
             class_name: :User,
             optional: true
  has_many :user_invite_courses, dependent: :destroy
  has_many :courses, through: :user_invite_courses

  validates :email,
            uniqueness: {
              case_sensitive: false
            },
            format: {
              with: URI::MailTo::EMAIL_REGEXP
            }
  validate :expiration_date_cannot_be_in_the_past

  before_save :downcase_email
  after_save :update_hubspot_contact
  before_destroy :revoke_access, prepend: true

  def downcase_email
    self.email.downcase!
  end

  def expired?
    expires_at.present? && expires_at < Date.today
  end

  def expiration_date_cannot_be_in_the_past
    errors.add(:expires_at, "can't be in the past") if expired?
  end

  def belongs_to?(user)
    user.present? && user.email == email
  end

  def revoke_access
    if user.present?
      courses.each do |course|
        user.remove_role(:participant, course) unless course.first?
      end
    end
  end

  private

  def update_hubspot_contact
    return unless Rails.configuration.features.dig(:hubspot)
    Rails.logger.info(
      "UserInvite: Update HubSpot contact for #{user&.email || email}"
    )
    invite = UserInvite.find_by_email(email)
    invited_user =
      User.new(email: email, user_access_type: invite.user_access_type, opt_out_eop: invite.opt_out_eop)
    HubspotService.new(user || invited_user).update_contact
  end
end
