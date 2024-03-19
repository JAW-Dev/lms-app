# app/jobs/access_expiration_job.rb
class AccessExpirationJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find(user_id)
    user.expire_access
  end
end
