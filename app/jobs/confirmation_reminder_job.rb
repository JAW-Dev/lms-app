class ConfirmationReminderJob < ApplicationJob
  queue_as :mailers

  def perform(user)
    unless user.confirmed?
      Accountant.confirmation_reminder(user, user.confirmation_token)
        .deliver_now
    end
  end
end
