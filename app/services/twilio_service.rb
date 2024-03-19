class TwilioService
  def initialize(user)
    @user = user
    credential_key = :twilio
    @account_sid = Rails.application.credentials.dig(credential_key, :account_sid)
    @auth_token = Rails.application.credentials.dig(credential_key, :auth_token)
  end

  def twilio_client
    Twilio::REST::Client.new(@account_sid, @auth_token)
  end

  def send_verification_code(verification_code, phone_number)
    begin
        message = "Your verification code is #{verification_code}"
        twilio_client.messages.create(
        from: Rails.application.credentials.dig(:twilio, :phone),
        to: phone_number,
        body: message
        )
    rescue Twilio::REST::TwilioError => e
        Rails.logger.error("An error occurred while sending SMS: #{e.message}")
        return { error: e.message }
    end
  end

  def send_message(phone_number, message_content)
      return unless Rails.env.production?

      begin
        twilio_client.messages.create(
          from: Rails.application.credentials.dig(:twilio, :phone),
          to: phone_number,
          body: message_content
        )
      rescue Twilio::REST::TwilioError => e
        Rails.logger.error("An error occurred while sending SMS: #{e.message}")
        return { error: e.message }
      end
  end
end
