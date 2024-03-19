# lib/tasks/schedule_access_expiration.rake
namespace :users do
  desc "Schedule access expiration for users"
  task schedule_access_expiration: :environment do
    User.find_each do |user|
      next if user.email.ends_with?('@admiredleadership.com') || user.email.ends_with?('@crainc.com')
      next unless user.access_expiration_date && user.access_expiration_date > Time.now.utc

      # Schedule the job to run at the user's access_expiration_date
      AccessExpirationJob.set(wait_until: user.access_expiration_date).perform_later(user.id)
    end
  end
end
