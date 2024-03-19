class ConfirmationWarningJob < ApplicationJob
  queue_as :mailers

  def perform(user)
    unless user.confirmed?
      Accountant.confirmation_warning(user, user.confirmation_token).deliver_now
    end
  end
end
