class Accountant < Devise::Mailer
  include MailerHelper
  include ApplicationHelper
  include Devise::Controllers::UrlHelpers

  default from: 'Admired Leadership <no-reply@mg.admiredleadership.com>'

  def confirmation_instructions(record, token, opts = {})
    key_suffix = default_full_access ? '_full' : ''
    subject =
      I18n.t("devise.mailer.confirmation_instructions.subject#{key_suffix}")
    if !mailgun_active
      mail(
        to: record.email,
        subject: subject,
        body: confirmation_url(record, confirmation_token: token)
      )
    else
      mail(to: record.email, subject: subject, body: '').tap do |message|
        message.mailgun_template =
          if default_full_access
            'account-confirmation-full'
          else
            'account-confirmation'
          end
        message.mailgun_headers = {
          'X-Mailgun-Variables':
            JSON.generate(
              {
                root_url: root_url,
                first_name: record&.profile&.first_name&.titlecase || 'there', # e.g. "Hi there"
                confirmation_link:
                  confirmation_url(record, confirmation_token: token)
              }
            )
        }
      end
    end
  end

  def confirmation_reminder(record, token, opts = {})
    key_suffix = default_full_access ? '_full' : ''
    subject = I18n.t("devise.mailer.confirmation_reminder.subject#{key_suffix}")
    if !mailgun_active
      mail(
        to: record.email,
        subject: subject,
        body: confirmation_url(record, confirmation_token: token)
      )
    else
      mail(to: record.email, subject: subject, body: '').tap do |message|
        message.mailgun_template =
          if default_full_access
            'account-confirmation-reminder-full'
          else
            'account-confirmation-reminder'
          end
        message.mailgun_headers = {
          'X-Mailgun-Variables':
            JSON.generate(
              {
                root_url: root_url,
                first_name: record&.profile&.first_name&.titlecase || 'there', # e.g. "Hi there"
                confirmation_link:
                  confirmation_url(record, confirmation_token: token),
                registration_date: record.created_at.strftime('%B %-d, %Y')
              }
            )
        }
      end
    end
  end

  def confirmation_warning(record, token, opts = {})
    key_suffix = default_full_access ? '_full' : ''
    subject = I18n.t("devise.mailer.confirmation_warning.subject#{key_suffix}")
    if !mailgun_active
      mail(
        to: record.email,
        subject: subject,
        body: confirmation_url(record, confirmation_token: token)
      )
    else
      mail(to: record.email, subject: subject, body: '').tap do |message|
        message.mailgun_template =
          if default_full_access
            'account-confirmation-warning-full'
          else
            'account-confirmation-warning'
          end
        message.mailgun_headers = {
          'X-Mailgun-Variables':
            JSON.generate(
              {
                root_url: root_url,
                first_name: record&.profile&.first_name&.titlecase || 'there', # e.g. "Hi there"
                confirmation_link:
                  confirmation_url(record, confirmation_token: token),
                registration_date: record.created_at.strftime('%B %-d, %Y')
              }
            )
        }
      end
    end
  end

  def reset_password_instructions(record, token, opts = {})
    if !mailgun_active
      mail(
        to: record.email,
        subject: I18n.t('devise.mailer.reset_password_instructions.subject'),
        body: edit_password_url(record, reset_password_token: token)
      )
    else
      mail(
        to: record.email,
        subject: I18n.t('devise.mailer.reset_password_instructions.subject'),
        body: ''
      ).tap do |message|
        message.mailgun_template = 'reset-password'
        message.mailgun_headers = {
          'X-Mailgun-Variables':
            JSON.generate(
              {
                root_url: root_url,
                first_name: record&.profile&.first_name&.titlecase,
                reset_password_link:
                  edit_password_url(record, reset_password_token: token)
              }
            )
        }
      end
    end
  end
end
