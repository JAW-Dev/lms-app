# == Schema Information
#
# Table name: users
#
#  id                     :bigint(8)        not null, primary key
#  access_type            :integer          default("standard_access")
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  current_sign_in_at     :datetime
#  current_sign_in_ip     :inet
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  last_sign_in_at        :datetime
#  last_sign_in_ip        :inet
#  provider               :string
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  settings               :jsonb            not null
#  sign_in_count          :integer          default(0), not null
#  sign_in_token          :string
#  sign_in_token_sent_at  :datetime
#  slug                   :string
#  uid                    :string
#  unconfirmed_email      :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  company_id             :bigint(8)
#  customer_id            :string
#  user_access_type       :string
#

class User < ApplicationRecord
  extend FriendlyId
  rolify

  # Include devise modules.
  omniauth_providers = ENV['SAML_IDP_METADATA_URL'].present? ? [:saml] : []
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :confirmable,
         :trackable,
         :omniauthable,
         omniauth_providers: omniauth_providers

  friendly_id :uuid, use: :slugged

  ransack_alias :profile, :profile_first_name_or_profile_last_name

  include PgSearch::Model
  pg_search_scope :search_for,
                  against: {
                    email: 'A',
                  },
                  associated_against: {
                    profile: %i[last_name first_name],
                  },
                  using: {
                    tsearch: {
                      prefix: true,
                    },
                  }

  attr_accessor :company_rep,
                :express_checkout,
                :has_gift,
                :account_number,
                :confirm_user,
                :payment_method_id,
                :remove_payment_method,
                :promoted_roles
  store_accessor :settings, :time_zone
  enum access_type: { standard_access: 0, direct_access: 1 }

  store_accessor :user_data

  belongs_to :company, optional: true
  accepts_nested_attributes_for :company

  has_one :profile, dependent: :destroy
  accepts_nested_attributes_for :profile

  has_many :viewed_behaviors,
           class_name: 'UserBehavior',
           foreign_key: :user_id,
           dependent: :destroy
  has_many :notes, class_name: 'Curriculum::Note', dependent: :destroy

  has_many :orders, dependent: :destroy
  has_many :course_orders, dependent: :destroy
  has_many :behavior_orders, dependent: :destroy
  has_many :bundle_orders, dependent: :destroy
  has_many :subscription_orders, dependent: :destroy

  has_many :help_to_habit_progresses, dependent: :destroy

  has_many :seats, class_name: 'UserSeat', dependent: :destroy

  has_one :user_invite, dependent: :destroy
  has_one :user_texting_preference
  accepts_nested_attributes_for :user_invite

  has_many :sent_invites, foreign_key: :invited_by_id, class_name: :UserInvite

  has_many :gifts

  has_many :user_quiz_question_answers, dependent: :destroy
  has_many :quiz_answers,
           through: :user_quiz_question_answers,
           source: :quiz_question_answer

  has_many :quiz_results, class_name: 'UserQuizResult', dependent: :destroy

  has_many :user_habits
  has_many :curriculum_behavior_maps, through: :user_habits

  scope :confirmed, -> { where.not(confirmed_at: nil) }
  scope :unconfirmed, -> { where(confirmed_at: nil) }

  validates :account_number, absence: { message: 'is invalid.' }
  validates_confirmation_of :password

  before_validation :has_company
  after_initialize :set_stripe_sub
  before_create :skip_confirmation!, if: :invited?
  before_create :set_password, if: :direct_access?
  after_create_commit :process_registration
  after_create_commit :set_default_course
  before_save :update_hubspot_contact
  after_save :update_access_type
  after_save :set_company_rep
  after_save :set_stripe_sub
  before_destroy :return_gifts

def has_beta_access?
  return true
  return false if self.email == 'admin@crainc.com' || self.email == 'administrator@crainc.com' || self.email == 'admin@admiredleadership.com'

  phase_1_emails = %w[
    anelson@crainc.com
    mgale@crainc.com
    mikeames@admiredleadership.com
    snehib@gmail.com
    taylor@admiredleadership.com
    snehi@admiredleadership.com
    scott@admiredleadership.com
    shay@admiredleadership.com
    wes@admiredleadership.com
    eli@admiredleadership.com
    sbaker@crainc.com
    pat.burke@carney.co
    bstringfellow@crainc.com
    rob@carney.co
    alexa.donahue@carney.co
    salsi.salama@carney.co
    amy.depalma@carney.co
    dean@eloquence.cloud
    ravi@eloquence.cloud
    basimbaig@gmail.com
    rich.odonnell@carney.co
    hixsonj@gmail.com
  ]

  return true if phase_1_emails.include?(self.email) || self.email.match?(/@(admiredleadership|crainc).com$/)

    # Beta Rollout Phase 2
    # const isEmployee = /@(admiredleadership|crainc).com$/.match?(@user.email)

    return false
  end

  def is_carney_team?
    return true
    team_emails = [
      "amy.depalma@carney.co",
      "alexa.donahue@carney.co",
      "rob@carney.co",
      "pat.burke@carney.co",
      "salsi.salama@carney.co",
      "jason.witt@carney.co",
      "sam.ruffino@carney.co",
      "jae.park@carney.co",
      "eli@admiredleadership.com",
      "michael@admiredleadership.com",
      "scott@admiredleadership.com",
      "sbaker@crainc.com",
      "shay@admiredleadership.com",
      "snehi@admiredleadership.com",
      "taylor@admiredleadership.com",
      "mikeames@admiredleadership.com",
      "sophie@admiredleadership.com",
      "rich.odonnell@carney.co",
      "basar.kutlu@carney.co",
      "hixsonj@gmail.com"
    ]

    email_domain = self.email.split('@').last

    # Check if the email domain matches either "admiredleadership.com" or "crainc.com"
    if email_domain == "admiredleadership.com" || email_domain == "crainc.com"
      return true
    end

    # Check if the email is in the list of specific email addresses
    team_emails.include?(self.email)
  end

  def has_v2_access?
    self.email == "pat.burke@carney.co"
  end

  def set_stripe_sub
    @stripe_sub = StripeService.new.retrieve_subscription(self)
  end

  def stripe_sub
    @stripe_sub
  end

  def renewal_data
    @stripe_sub
  end

  def manual_purchase_data
    course_orders.where(status: 'complete')&.first
  end

  def is_corporate?
  end



  def db_sub
    if stripe_sub.present?
      subscription_orders.detect { |obj| obj.transaction_id == stripe_sub.id }
    end
  end

  def with_profile_and_company
    build_profile
    build_company
    self
  end

  def profile
    super || build_profile
  end

  def uuid
    SecureRandom.uuid
  end

  def enrolled_courses
    Curriculum::Course.with_role(:participant, self)
  end

  def gifted_behaviors
    Curriculum::Behavior.with_role(:participant, self)
  end

  def enrolled_in?(program_content)
    if program_content.title == 'Foundations'
      return self.has_role?(:participant, program_content)
    end

    if user_all_gifts.any? { |gift| gift.behavior == program_content }
      return true
    end

    has_valid_access? && self.has_role?(:participant, program_content)
  end


  def has_valid_access?
    return true if /@(admiredleadership|crainc).com$/.match?(self.email)
    if stripe_sub.present?
      return true if stripe_sub&.status == 'active'
    end
    return false if !access_expiration_date.present?
    DateTime.now < access_expiration_date
  end

  def full_purchase
    course_orders.complete
  end

  def subscription
    subscription_orders.complete
  end

  def gifts_sent
    self.behavior_orders.complete.map(&:gift)
  end

  def gifts_sent_redeemed
    self.behavior_orders.complete.map(&:gift).compact.filter(&:redeemed?)
  end

  def gifts_received
    self.gifts
  end

  def gifts_received_redeemed
    self.gifts.redeemed
  end

  def gift_recipient?
    gifts_received_redeemed.present?
  end

  def user_all_gifts
    Gift.where(recipient_email: self.email, status: "redeemed")
  end

  def has_full_access?
    default_full_access || full_purchase.any? || user_invite&.unlimited?
  end

  def has_free_gift?
    has_role?(:unlimited_gifts) || cra_employee? ||
      behavior_orders.complete.where(subtotal_cents: 0).none?
  end

  def yearly_invite?
    user_invite&.unlimited? &&
      profile&.hubspot['access_type'] == 'Annual Access'
  end

  def up_for_renewal?
    if has_full_access?
      (user_invite.blank? || yearly_invite?) && access_expiration_date &&
        DateTime.now + 2.weeks >= access_expiration_date &&
        DateTime.now < access_expiration_date + 60.days
    else
      false
    end
  end

  def active_subscription
    subscription.last || subscription_orders.resubscribed.last
  end

  def can_purchase_subscription?
    has_full_access? &&
      (!stripe_sub.present? || stripe_sub.status == 'canceled')
  end

  def subscription_start_date
    dates = []
    dates << full_purchase.last.sold_at + 1.year if full_purchase.any?
    dates << user_invite.expires_at if user_invite.present?

    dates.sort.last
  end

  def access_expiration_date
    dates = []
    dates << full_purchase.last.sold_at + 1.year if full_purchase.any?
    dates << user_invite.expires_at if user_invite.present?
    if stripe_sub.present? && stripe_sub.status == 'active'
      stripe_date = Time.at(stripe_sub.current_period_end).utc
      dates << stripe_date
    end

    # pick the date furthest out in the future
    dates.sort.last
  end

  def expire_access
    # 1. Check if the user's access_expiration_date is after current time + 1 minute
    if access_expiration_date.present? && access_expiration_date > (Time.now.utc + 1.minute)
      # If it is, schedule another job at the user's access_expiration_date and return
      AccessExpirationJob.set(wait_until: access_expiration_date).perform_later(self.id)
      return
    end

    # 2. At this point, it means the user no longer has access
    # 3. Get their access_type
    current_access_type = self.profile.access_type

    # 4. Append "EXPIRED" to the new access_type
    self.profile.access_type = "EXPIRED #{current_access_type}"

    # 5. Save the user and do not schedule another job
    self.profile.save
  end

  def subscription_discontinued?
    subscription = existing_subscription_on_stripe
    subscription.cancel_at_period_end if subscription.present?
  end

  def renewal_date
    full_purchase.any? || subscription.any? ? access_expiration_date : nil
  end

  def cra_employee?
    confirmed? && (profile.access_type === 'Employee Access' || /@(admiredleadership|crainc).com$/.match?(email) || has_role?(:cra_employee))
  end


  def remove_direct_access
    if has_full_access?
      self.access_type = 'standard_access'
      self.profile&.hubspot['access_type'] = 'Annual Access'
    else
      self.access_type = 'standard_access'
      self.profile&.hubspot['access_type'] = '5 Free Videos'
    end
    self.save()
  end

  protected

  def default_full_access
    Rails.configuration.features.dig(:options)&.dig(:default_full_access)
  end

  def password_required?
    (default_full_access || direct_access?) ? false : super
  end


  private

  def self.from_omniauth(auth)
    auth_user = User.where(provider: auth.provider, uid: auth.uid)
    email_user = User.where(email: auth.info.email)
    user = auth_user.or(email_user).first
    if user && (!user.provider || !user.uid)
      user.provider = auth.provider
      user.uid = auth.uid
      user.save
    end
    user
  end

  def self.create_from_omniauth(auth)
    profile_data = auth.info.slice(:first_name, :last_name)
    user_data =
      auth.slice(:provider, :uid).merge(
        email: auth.info.email,
        confirmed_at: DateTime.now,
        access_type: :direct_access,
      )
    user = User.new(user_data.to_h)
    user.build_profile(profile_data.to_h)
    user.save
    user
  end

  def has_company
    self.company = nil if new_record? && company_rep != '1'
  end

  def invited?
    invited = UserInvite.any? { |invitation| invitation.email == email }
    seated = UserSeat.any? { |seat| seat.email == email }
    gifted =
      Gift.any? { |gift| gift.recipient_email == email } || has_gift.present?
    invited || seated || gifted || express_checkout.present?
  end

  def process_registration
    invitation = UserInvite.find_by_email(self.email)
    registrar = RegistrationService.new(self)
    seat = UserSeat.find_by_email(email)
    registrar.activate_seat(seat)
  end

  def set_default_course
    intro_course = Curriculum::Course.enabled.find_by_position(1)
    add_role(:participant, intro_course)
  end

  def set_password
    self.password = Devise.friendly_token
  end

  def update_hubspot_contact
    return unless Rails.configuration.features.dig(:hubspot)
    Rails.logger.info("User: Update HubSpot contact for #{email_was}")
    HubspotService.new(self).update_contact(prev_email: email_was)
  end

  def update_access_type
    self.access_type = :standard_access if encrypted_password_changed?
  end

  def set_company_rep
    if company_rep.present?
      remove_role :company_rep, company
      add_role :company_rep, company if company_rep == '1' && company.present?
    end
  end

  def return_gifts
    gifts.each { |gift| RegistrationService.new(self).return_gift(gift) }
  end
end
