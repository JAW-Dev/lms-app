class SendTextJob < ApplicationJob
  unique :until_executing, on_conflict: :log
  queue_as :default

  def perform(user_id)
    prepare(user_id)
    begin
      @twilio_service.send_message(@user.profile.phone, @message)
      HelpToHabit.logger.info "sending SMS ##{@current_progress.progress + 1} to #{@user.email} for behavior #{@behavior.id}"
      after_action
    rescue StandardError => e
      Rails.logger.error("Failed to send text message: #{e.message}")
      # Here, you could also notify your error tracking service
    end
  end

  private

  def prepare(user_id)
    @user_id = user_id
    @user = User.find(user_id)
    @twilio_service = TwilioService.new(@user)
    @current_progress = HelpToHabitProgress.find_by(user_id: user_id, queue_position: 1)
    @behavior = @current_progress.curriculum_behavior
    if @current_progress
      @current_h2h = HelpToHabit.find_by(curriculum_behavior_id: @behavior.id, order: @current_progress.progress + 1)
      @message = @current_h2h&.content
    end
  end

  def after_action
    @current_progress.increment!(:progress)

    # Sending weekly recap if the progress modulo 7 is 0
    # send_weekly_recap if @current_progress.progress % 7 == 0

    # If @current_progress.start_date exists, set it as nil then save
    if @current_progress.start_date
      @current_progress.start_date = nil
      @current_progress.is_active = true
      @current_progress.save
    end

    next_h2h = @current_h2h.next
    if next_h2h
      # @current_progress.activate_texting_in_30_minutes
      @current_progress.activate_texting(true)
      HelpToHabit.logger.info "queueing next SMS for #{@user.email} for behavior #{@behavior.id} (#{@current_progress.sidekiq_job_id})"
    else
      finalize_current_progress
    end
  end

  def finalize_current_progress
    current_queue_position = @current_progress.queue_position

    # User has finished the campaign, so we update the current progress to hide it from the queue
    @current_progress.update!(queue_position: nil, completed: true, is_active: false, sidekiq_job_id: nil, progress: 0)

    HelpToHabit.logger.info "#{@user.email} finished reminders for behavior #{@behavior.id}"

    # And move up all the other campaigns
    @user.help_to_habit_progresses.where(completed: [nil, false]).where('queue_position > ?', current_queue_position).update_all('queue_position = queue_position - 1')

    # Send weekly recap
    # send_weekly_recap

    # Get the next progress in the queue and activate texting
    next_progress = @user.help_to_habit_progresses.find_by(queue_position: 1, completed: [nil, false])
    outro_text = @behavior.h2h_outro&.content.presence
    if next_progress.present?
      next_progress.update(is_active: true)
      # queue SMS without initial text/email
      next_progress.activate_texting(true, true)
      default_text = "Congratulations! You've completed #{@behavior.title}. You're on your way to start a new habit with #{next_progress.curriculum_behavior.title}. "
      @twilio_service.send_message(@user.profile.phone, outro_text || default_text)
      HelpToHabit.logger.info "#{@user.email} starting reminders for behavior #{next_progress.curriculum_behavior_id}"
    else
      # Send final email
      send_final_email
      # Send ending text
      default_text = "Congratulations! You've completed #{@behavior.title}. To start a new program and set your habit reminders, check into your dashboard now: https://explore.admiredleadership.com/v2"
      @twilio_service.send_message(@user.profile.phone, outro_text || default_text)
    end
  end

  def send_final_email
    Messenger.h2h_final(@user, @behavior.title).deliver_now
  end

  def send_weekly_recap
    week_number = @current_progress.progress / 7
    week_names = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven"]
    week = week_names[week_number]
    
    habits = last_7_habits
    behavior = @current_progress.curriculum_behavior

    # You will need to replace this with the appropriate method call to your mailer
    Messenger.h2h_weekly_recap(habits, week, @user, behavior.title).deliver_now
  end

  def last_7_habits
    # Assuming the habits are stored as strings in HelpToHabit and are associated with the current progress
    HelpToHabit.where(curriculum_behavior_id: @current_progress.curriculum_behavior_id)
               .order('"order" DESC')
               .limit(7)
               .pluck(:content) # Assuming the habit is stored in a column named 'habit'
  end
end
