class HelpToHabitProgress < ApplicationRecord
    #                     :id => :integer,
    #                :user_id => :integer,
    # :curriculum_behavior_id => :integer,
    #               :progress => :integer,
    #              :is_active => :boolean,
    #             :created_at => :datetime,
    #             :updated_at => :datetime,
    #         :queue_position => :integer,
    #             :start_date => :date,
    #              :completed => :boolean
    #         :sidekiq_job_id => :string

  belongs_to :user
  belongs_to :curriculum_behavior, class_name: 'Curriculum::Behavior'

  # validates :user_id, uniqueness: { scope: :user_id, message: "You cannot have more than 3 progress entries." }, unless: :user_progress_limit_reached?

  after_save :update_hubspot_campaign

  def activate_texting(disable_initial_text = false, disable_initial_email = false)
    date = start_date || Date.tomorrow
    # 8am to 7pm
    random_hour = (8..19).to_a.sample
    random_minute = (0..59).to_a.sample
    scheduled_time = date.in_time_zone(user.settings["time_zone"]).change(hour: random_hour, min: random_minute).utc

    scheduled_time += 1.day if scheduled_time < Time.now.utc
    if !disable_initial_text
      default_text =  "Thank you for signing up for Help to Habit. Over the next 30 days, you'll receive helpful tips and reminders about '#{self.curriculum_behavior.title}' via email + SMS.\n- Admired Leadership"
      intro_text = curriculum_behavior.h2h_intro&.content.presence || default_text
      TwilioService.new(self.user).send_message(self.user.profile.phone, intro_text)
    end

    job = SendTextJob.set(wait_until: scheduled_time).perform_later(self.user.id)
    if job
      update(sidekiq_job_id: job.provider_job_id)
    else
      HelpToHabit.logger.info "Could not queue #{curriculum_behavior_id} for #{user.email}. Check for duplicate jobs."
    end

    # Send email if start_date exists
    if start_date && !disable_initial_email
      Messenger.initial_h2h_sign_up(self.user).deliver_now
    end
  end


  def activate_texting_in_30_minutes
    job = SendTextJob.set(wait: 30.minutes).perform_later(self.user.id)
    update(sidekiq_job_id: job.provider_job_id)
  end

  def cancel_texting
    return unless sidekiq_job_id

    queue = Sidekiq::ScheduledSet.new
    job_ids = queue.map(&:jid)


    job = queue.find { |j| j.jid == sidekiq_job_id }

    if job
      job.delete
      SendTextJob.unlock!(user.id)
      self.sidekiq_job_id = nil
      self.save
    else
      puts "Job not found"
    end
  end


  private

  #TODO: This is pretty slow, can we offload to a sidekiq job?
  def update_hubspot_campaign
    hubspot_service = HubspotService.new(self.user)
    hubspot_service.update_h2h_campaign(self.curriculum_behavior.title)
  end

  def user_progress_limit_reached?
    self.user.help_to_habit_progresses.count < 3
  end

end
