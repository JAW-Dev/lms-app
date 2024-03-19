class ApplicationMailer < ActionMailer::Base
  include MailerHelper

  include Pres::Presents
  helper_method :present

  default from: 'Admired Leadership <no-reply@mg.admiredleadership.com>'
  layout 'mailer'
end
