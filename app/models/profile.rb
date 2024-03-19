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

class Profile < ApplicationRecord
  store_accessor :hubspot,
                 :access_type,
                 :source,
                 :source_person,
                 :profile_url,
                 :company,
                 :lms_instance_url

  belongs_to :user

  validates :first_name, :last_name, presence: true, unless: :direct_access?

  mount_uploader :avatar, ImageUploader

  before_save :normalize_names #, unless: :direct_access?
  before_save :unverify_phone_if_changed
  before_save :update_hubspot_contact

  after_save :update_hubspot_scheduled_time


  def hubspot_properties
    hubspot.except('profile_url').filter { |key, value| value.present? }
  end

  def has_name?
    first_name && last_name
  end

  def can_request_verification_code?
    # If the user has never requested a verification code
    if last_verification_code_request_at.nil?
      self.last_verification_code_request_at = Time.now
      self.verification_code_requests = 1
      return true
    end

    if last_verification_code_request_at < 1.hour.ago
      # If it's been more than an hour since the last request, reset the counter and allow
      self.verification_code_requests = 0
      self.last_verification_code_request_at = Time.now
      return true
    end

    # If the user has requested less than 5 verification codes in the last hour, allow
    if verification_code_requests < 5
      self.verification_code_requests += 1
      self.last_verification_code_request_at = Time.now
      return true
    end

    # Otherwise, don't allow a new code to be requested
    false
  end

  def generate_phone_verification_code(user)
    return { error: "Too many verification code requests. Please try again later." } unless can_request_verification_code?

    begin
      verification_code = SecureRandom.random_number(100000..999999).to_s
      hashed_verification_code = BCrypt::Password.create(verification_code)
      self.phone_temp_verification_code = hashed_verification_code
      self.phone_temp_verification_code_expiration = Time.now + 5.minutes
      save!

      twilio_service = TwilioService.new(user) 
      twilio_service.send_verification_code(verification_code, self.phone)
      rescue StandardError => e
        Rails.logger.error("An error occurred while generating phone verification code: #{e.message}")
        return { error: e.message }
      end
  end

  def unverify_phone_if_changed
    self.phone_verified = false if phone_changed?
  end


  private

  def update_hubspot_scheduled_time
    hubspot_service = HubspotService.new(self.user)
    hubspot_service.update_scheduled_time(self.scheduled_time)
  end

  def normalize_names
    return unless first_name.present? && last_name.present?
    names = NameCleaner.new(first_name, last_name)
    self.first_name = names.clean_first_name
    self.last_name = names.clean_last_name
  end

  def direct_access?
    user.direct_access?
  end

  def update_hubspot_contact
    return unless Rails.configuration.features.dig(:hubspot)
    Rails.logger.info("Profile: Update HubSpot contact for #{user.email}")
    HubspotService.new(user).update_contact
  end
end
