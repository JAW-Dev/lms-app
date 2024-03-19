class HubspotService
  include Rails.application.routes.url_helpers

  include HTTParty
  base_uri 'https://api.hubapi.com'

  def initialize(user)
    @user = user
    credential_key = Rails.env.production? ? :hubspot : :hubspot_dev
    @portal_id = Rails.application.credentials.dig(credential_key, :portal_id)
    @hubspot_api_key =
      Rails.application.credentials.dig(credential_key, :api_key)
  end

  # HubSpot dates must be formatted as midnight UTC millisecond UNIX timestamps
  def midnight_utc_ms(time)
    time.utc.to_datetime.change(hour: 0, minute: 0, second: 0).strftime('%Q')
  end

  # HubSpot date properties must be less than 1000 years past/future
  def format_date_property(property)
    return '' unless property

    date_ms = midnight_utc_ms(property)
    date_min_ms = midnight_utc_ms(DateTime.now - 365 * 1000)
    date_max_ms = midnight_utc_ms(DateTime.now + 365 * 1000)
    [[date_min_ms, date_ms].max, date_max_ms].min
  end

  def base_properties(email)
    [
      { property: 'email', value: email },
      { property: 'firstname', value: @user.profile.first_name },
      { property: 'lastname', value: @user.profile.last_name },
      { property: 'registered_', value: 'Yes' },
      {
        property: 'registered_date',
        value: format_date_property(@user.created_at)
      },
      { property: 'opt_in', value: @user.profile.opt_in },
      { property: 'confirmed_account_', value: @user.confirmed? },
      { property: 'access_type', value: @user.profile.access_type || @user.user_access_type },
      { property: 'opt_out_eop', value: @user.profile.opt_out_eop || @user.opt_out_eop },
      {
        property: 'lms_invite_invited_at',
        value: format_date_property(@user.user_invite&.invited_at)
      },
      {
        property: 'lms_invite_invited_by',
        value: @user.user_invite&.invited_by&.email
      },
      {
        property: 'lms_invite_expires_at',
        value: format_date_property(@user.user_invite&.expires_at)
      },
      {
        property: 'lms_user_full_purchase_sold_at',
        value: format_date_property(@user.full_purchase&.first&.sold_at)
      },
      {
        property: 'lms_user_access_expiration_date',
        value: format_date_property(@user.access_expiration_date)
      },
      {
        property: 'lms_user_renewal_date',
        value: format_date_property(@user.renewal_date)
      },
      { property: 'lms_instance_url', value: root_url },
      { property: 'lms_gifts_sent_count', value: @user.gifts_sent.count },
      {
        property: 'lms_gifts_sent_redeemed_count',
        value: @user.gifts_sent_redeemed.count
      },
      {
        property: 'lms_gifts_received_count',
        value: @user.gifts_received.count
      },
      {
        property: 'lms_gifts_received_redeemed_count',
        value: @user.gifts_received_redeemed.count
      },
      { property: 'phone', value: @user.profile.phone },
      { property: 'company', value: @user.profile.company_name }
    ]
  end

  def get_contact_properties(email = @user.email)
    return {} if Rails.env.test? || Rails.env.ci?

    options = {
      headers: {
        'Content-Type' => 'application/json',
        'Authorization' => 'Bearer ' + @hubspot_api_key
      },
      format: :json
    }

    response =
      self.class.get(
        "/crm/v3/objects/contacts/#{email}?idProperty=email",
        options
      )
    begin
      response['properties'].merge(
        'profile_url' => {
          'value' => response['profile-url']
        }
      )
    rescue StandardError
      {}
    end
  end

  def get_options(property)
    options = {
      headers: {
        'Content-Type' => 'application/json',
        'Authorization' => 'Bearer ' + @hubspot_api_key
      },
      format: :json
    }

    response =
      self.class.get(
        "/crm/v3/properties/contacts/#{property}",
        options
      )
    begin
      response['options']
    rescue StandardError
      []
    end
  end

  def from_current_instance?(email)
    properties = get_contact_properties(email)
    instance_url = properties.dig('lms_instance_url', 'value')
    instance_url.nil? || instance_url === root_url
  end

  def update_contact(properties: [], prev_email: nil)
    return 200 unless Rails.env.production?

    # lookup HS contact by previous email if set
    email = prev_email.present? ? prev_email : @user.email

    # skip if user originated from another instance
    unless from_current_instance?(email)
      HubspotService
        .logger.info "Skipping #{email} because user originated from another instance."
      return 200
    end

    body = {
      # set email property to new/current email to update HS email
      properties: base_properties(@user.email) + properties
    }

    options = {
      body: JSON.generate(body),
      format: :json,
      headers: {
        'Content-Type' => 'application/json',
        'Authorization' => 'Bearer ' + @hubspot_api_key
      }
    }

    begin
      response =
        self.class.post(
          "/contacts/v1/contact/createOrUpdate/email/#{email}/",
          options
        )

      case response.code
      when 200
        HubspotService.logger.info "Updated #{email}"
      else
        HubspotService
          .logger.error "Error updating #{email} to Hubspot: #{response.message}"
      end

      response.code
    rescue StandardError => e
      HubspotService
        .logger.error "Error updating #{email} to Hubspot: #{e.inspect}"
      500
    end
  end

  def add_giftee(gift)
    properties = [
      { property: 'gift_recipient', value: 'Yes' },
      {
        property: 'source_person',
        value: ProfilePresenter.new(gift.order.user.profile).full_name
      }
    ]

    update_contact(properties: properties)
  end

  def update_h2h_campaign(behavior_name)
    properties = [
      { property: 'h2h_campaign', value: behavior_name }
    ]

    update_contact(properties: properties)
  end

  def update_scheduled_time(scheduled_time)
    properties = [
      { property: 'h2h_scheduled_time', value: scheduled_time }
    ]

    update_contact(properties: properties)
  end

  def podcast_cta(user)
    email = user.email

    options = {
      headers: {
        'Content-Type' => 'application/json',
        'Authorization' => 'Bearer ' + @hubspot_api_key
      }
    }

    workflow = Rails.application.credentials[Rails.env.to_sym].dig(
      :hubspot_workflows,
      :get_your_links
    )

    begin
      response =
        self.class.post(
          "/automation/v2/workflows/#{workflow}/enrollments/contacts/#{email}",
          options
        )

      case response.code
      when 200
        HubspotService.logger.info "Podcast CTA triggered for #{email}"
      when 204
        HubspotService.logger.info "Podcast CTA triggered for #{email}"
      else
        HubspotService.logger.error "Error triggering podcast CTA for #{email}: #{response.message}"
        abort response.message
      end

      response.code
    rescue StandardError => e
      HubspotService.logger.error "Error triggering podcast CTA for #{email}: #{e.inspect}"
      500
    end
  end

  def self.logger
    @@logger ||=
      ActiveSupport::Logger.new(Rails.root.join('log', 'hubspot.log'))
  end
end
