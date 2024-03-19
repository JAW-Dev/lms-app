module MailerHelper
  def mailgun_active
    Rails.configuration.action_mailer.delivery_method === :mailgun
  end
end
