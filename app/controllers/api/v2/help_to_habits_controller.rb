class Api::V2::HelpToHabitsController < ApiController
  skip_before_action :verify_authenticity_token
  
  def get_progresses
    progresses = current_user.help_to_habit_progresses.includes(:curriculum_behavior).where.not(queue_position: nil).order(:queue_position).map do |progress|

      current_content = progress.curriculum_behavior.help_to_habits.find_by(order: progress.progress)&.content
      courses = Curriculum::Course.includes(:behaviors).enabled.order(position: :asc)
      course = courses.find{ |course| course.behaviors.include?(progress.curriculum_behavior) }
      behavior = Curriculum::Behavior.find(progress.curriculum_behavior.id)

      progress.attributes.merge(
        behavior: behavior,
        behavior_title: progress.curriculum_behavior.title,
        behavior_id: progress.curriculum_behavior.id,
        module: course,
        total_content: progress.curriculum_behavior.help_to_habits.count,
        poster: progress.curriculum_behavior.poster,
        current_content: current_content,
        h2h_opt_out: current_user.h2h_opt_out
      )
    end

    render json: progresses, status: :ok
  end

  def get_users_progresses
    all_progresses = []

    # Loop through all users who have help_to_habit_progresses
    User.includes(:help_to_habit_progresses).where.not(help_to_habit_progresses: { id: nil }).find_each do |current_user|
      progresses = current_user.help_to_habit_progresses.includes(:curriculum_behavior).where.not(queue_position: nil).order(:queue_position).map do |progress|
      current_content = progress.curriculum_behavior.help_to_habits.find_by(order: progress.progress)&.content
      courses = Curriculum::Course.includes(:behaviors).enabled.order(position: :asc)
      course = courses.find { |course| course.behaviors.include?(progress.curriculum_behavior) }
      behavior = Curriculum::Behavior.find(progress.curriculum_behavior.id)

      progress.attributes.merge(
        email: current_user.email,
        name: current_user.profile.first_name + " " + current_user.profile.last_name,
        phone: current_user.profile.phone,
        behavior: behavior,
        behavior_title: progress.curriculum_behavior.title,
        behavior_id: progress.curriculum_behavior.id,
        module: course,
        total_content: progress.curriculum_behavior.help_to_habits.count,
        poster: progress.curriculum_behavior.poster,
        current_content: current_content,
        profile: current_user.profile
      )
    end

    all_progresses.concat(progresses)
  end

  render json: all_progresses, status: :ok
  end

  def latest_completed_with_behavior_maps
    latest_completed_behavior = current_user.viewed_behaviors
                                            .joins(behavior: :behavior_maps)
                                            .where(status: "completed")
                                            .order(updated_at: :desc)
                                            .first

    if latest_completed_behavior.nil?
      render json: { status: "none" }, status: :ok
    else
      render json: latest_completed_behavior.behavior.as_json(include: :behavior_maps), status: :ok
    end
  end

  def delete_progresses
    progress_ids = params[:progress_ids]
    progresses = current_user.help_to_habit_progresses.where(id: progress_ids)

    progresses.each do |progress|
      progress.cancel_texting if progress.sidekiq_job_id
    end

    first_in_queue = current_user.help_to_habit_progresses.order(queue_position: :asc).first

    if progress_ids.include?(first_in_queue.id) && current_user.help_to_habit_progresses.count > progress_ids.count
      progresses.destroy_all
      adjust_queue_positions
      HelpToHabit.logger.info "#{current_user.email} removed active reminder"
      render json: { status: "activeDeleted" }, status: :ok
    else
      progresses.destroy_all
      adjust_queue_positions(exclude_first: true)
      HelpToHabit.logger.info "#{current_user.email} removed all reminders"
      render json: { status: "allDeleted" }, status: :ok
    end
  end

  def schedule_habit
    progress_id = params[:progress_id]
    selected_day = params[:selected_day]

    # Find the progress by ID
    progress = HelpToHabitProgress.find_by(id: progress_id)

    # Return error if not found
    unless progress
      render json: { error: "Progress not found" }, status: :not_found
      return
    end

    # Update the start_date
    progress.start_date = selected_day

    # Save changes and check if it's successful
    if progress.save
      # Call the .activate_texting method here
      progress.activate_texting

      # Update the queue positions of progresses which are between the current position of the selected progress
      # and the first position in the queue
      (1...progress.queue_position).each do |position|
        p = current_user.help_to_habit_progresses.find_by(queue_position: position)
        p.update(queue_position: position + 1) if p
      end

      # Make the updated progress the first one in the queue
      progress.update(queue_position: 1)

      render json: { message: "Progress updated successfully" }, status: :ok
    else
      render json: { error: "Failed to update progress" }, status: :unprocessable_entity
    end
  end

  def receive_sms
    # Extract sender's phone number and message body from incoming parameters
    sender_number = params['From']
    message_body = params['Body'].strip.downcase

    # Remove any leading '+1' from the sender's phone number
    clean_number = sender_number.gsub(/^\+1/, '')

    # Find the user based on the cleaned phone number
    user = User.joins(:profile).where(profile: { phone: clean_number }).first
    # ngrok http --domain=admiredleadership.ngrok.dev 3000

    if message_body == 'stop'
      # Retrieve and process all help-to-habit progresses for the user
      progresses = user.help_to_habit_progresses.includes(:curriculum_behavior).where.not(queue_position: nil).order(:queue_position).map do |progress|
        if progress
          # Deactivate the progress, cancel texting, and opt out the user
          progress.update(is_active: false)
          progress.cancel_texting
          user.h2h_opt_out = true
          user.save
        end
      end

      Messenger.h2h_opt_out(user).deliver_now

    elsif message_body == 'start'
      # Retrieve and process all help-to-habit progresses for the user
      progresses = user.help_to_habit_progresses.includes(:curriculum_behavior).where.not(queue_position: nil).order(:queue_position)

      # Activate the first progress if it exists, start texting, and opt in the user
      first_progress = progresses.first
      if first_progress
        first_progress.update(is_active: true)
        first_progress.activate_texting(true, true)
        user.h2h_opt_out = false
        user.save
      end
    end
  end

  private

  def adjust_queue_positions(exclude_first: false)
    offset = exclude_first ? 1 : 0
    progresses = current_user.help_to_habit_progresses.where(completed: [nil, false]).order(queue_position: :asc).offset(offset)

    progresses.each_with_index do |progress, index|
      progress.queue_position = index + 1
      progress.is_active = progress.queue_position == 1
      progress.activate_texting(true, true) if progress.is_active && progress.sidekiq_job_id.blank?
      progress.save!
    end
  end
end
