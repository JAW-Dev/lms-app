require 'base64'

class Api::V2::UsersController < ApiController
  before_action :initialize_twilio_service, only: [:hello]
  before_action :set_subscription_order, only: [:cancel_subscription, :process_resubscription]

  def index
    if current_user
      user_data = current_user.as_json(include: :profile)
      user_data[:roles] = current_user.roles.map(&:name).uniq
      user_data[:help_to_habit_progress_count] = current_user.help_to_habit_progresses.where.not(queue_position: nil).count
      user_data[:help_to_habit_progress_completed_count] = current_user.help_to_habit_progresses.where(completed: true).count
      user_data[:is_carney_team] = current_user.is_carney_team?
      user_data[:is_employee] = current_user.cra_employee?

      render json: { user: user_data }, status: :ok
    else
      render json: {}, status: :ok
    end
  end

  def watch
    begin
      behavior = Curriculum::Behavior.friendly.find watch_params[:behavior_id]
      view = UserBehavior.find_or_create_by(user: current_user, behavior: behavior)
      view.update(status: watch_params[:status])
      render status: :ok, json: { status: view.status }
    rescue StandardError
      render status: :bad_request, json: { message: 'Error updating view.' }
    end
  end

  def set_phone_number
    begin
      sanitized_phone_number = sanitize_phone_number(params[:phone_number])
      current_user.profile.phone = sanitized_phone_number
      if current_user.profile.save
        render json: { message: "Phone number updated successfully" }, status: :ok
      else
        render json: { message: "Error updating phone number" }, status: :unprocessable_entity
      end
    rescue StandardError => e
      render json: { message: e.message }, status: :bad_request
    end
  end


  def sanitize_phone_number(phone_number)
      phone_number.gsub(/\D/, '')
  end

  def generate_and_save_verification_code
    current_profile = current_user.profile
    response = current_profile.generate_phone_verification_code(current_user)

    # if response[:error].present?
    #   render json: { message: response[:error] }, status: :unprocessable_entity
    # else
      render json: { message: "Verification code generated and sent successfully" }, status: :ok
    # end
  end

  def confirm_verification_code
    # Get the profile of the current user
    current_profile = current_user.profile

    # Get the inputted verification code
    input_verification_code = params[:verification_code]

    # Get the stored hashed verification code
    hashed_verification_code = current_profile.phone_temp_verification_code

    # Compare the hashed value with the entered code
    if BCrypt::Password.new(hashed_verification_code) == input_verification_code
      # Set phone_verified to true and save
      current_profile.update(phone_verified: true)
      render json: { status: 'success', message: 'Verification successful' }, status: :ok
    else
      render json: { status: 'error', message: 'Invalid verification code' }, status: :unauthorized
    end
  end

  def time_zones
    # Define an array with the most common timezones
    common_time_zones = [
      "Pacific Time (US & Canada)",
      "Mountain Time (US & Canada)",
      "Central Time (US & Canada)",
      "Eastern Time (US & Canada)",
      "Atlantic Time (Canada)",
      "Hawaii",
      "Alaska",
      "Arizona",
      "Indiana (East)",
      "London",
      "Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
      "Athens, Istanbul, Minsk",
      "Brussels, Copenhagen, Madrid, Paris",
      "West Central Africa",
      "Johannesburg",
      "Moscow, St. Petersburg, Volgograd",
      "Abu Dhabi, Muscat",
      "New Delhi",
      "Islamabad, Karachi",
      "Kathmandu",
      "Astana, Dhaka",
      "Yangon (Rangoon)",
      "Bangkok, Hanoi, Jakarta",
      "Beijing, Chongqing, Hong Kong, Urumqi",
      "Perth",
      "Singapore",
      "Taipei",
      "Osaka, Sapporo, Tokyo",
      "Seoul",
      "Yakutsk",
      "Adelaide",
      "Darwin",
      "Brisbane",
      "Sydney, Melbourne, Hobart",
      "Guam, Port Moresby",
      "Vladivostok",
      "Auckland, Wellington",
      "Fiji, Kamchatka, Marshall Is."
    ]

    # Filter all time zones to include only the ones from the common_time_zones array
    common_zones = ActiveSupport::TimeZone.all.select { |zone| common_time_zones.include?(zone.name) }

    # Format the result as required
    result = common_zones.map do |zone|
      {
        time_zone: zone.name,
        offset: zone.formatted_offset,
        identifier: zone.tzinfo.name
      }
    end

    render json: result
  end

  def subscribe_to_h2h

    behavior_id = params[:behaviorID]
    time_zone = params[:timeZone]
    start_date = params[:startDate]

    # Store it in the user's profile
    current_user.update(settings: { time_zone: time_zone }) if time_zone

    new_h2h_progress(behavior_id, start_date)

    render json: { message: "Successfully subscribed to Help to Habit" }, status: :ok
  end

  def new_h2h_progress(behavior_id, start_date)
    # Check if the user has already a progress for this behavior
    existing_progress = HelpToHabitProgress.find_by(user_id: current_user.id, curriculum_behavior_id: behavior_id, is_active: false, completed: [nil, false])

    # If there's no progress yet for this behavior, we create a new one
    unless existing_progress
      progress = HelpToHabitProgress.new
      progress.user_id = current_user.id
      progress.curriculum_behavior_id = behavior_id
      progress.start_date = start_date
      progress.progress = 0

      last_queue_position = HelpToHabitProgress.where(user_id: current_user.id).maximum(:queue_position)
      progress.queue_position = last_queue_position ? last_queue_position + 1 : 1
      progress.is_active = progress.queue_position == 1

      if progress.save && progress.queue_position == 1
        progress.activate_texting
      end

      HelpToHabit.logger.info "#{current_user.email} subscribed to behavior #{behavior_id}"

    else
      return
    end
  end

  def update_h2h
    existing_progresses = HelpToHabitProgress.where(user_id: current_user.id)

    # Cancel the existing scheduled send and start new jobs
    begin
      current_user.update(settings: { time_zone: h2h_params[:time_zone] })
      current_user.profile.update(phone: h2h_params[:phone])
      existing_progresses.each do |progress|
        progress.cancel_texting
        progress.activate_texting(true, true)
      end
      render json: { message: 'Updated settings' }, status: :ok
    rescue
      render json: { message: 'Error updating settings' }, status: :bad_request
    end
  end

  def update_queue_order
    ordering = h2h_params[:reorder]
    begin
      progresses = HelpToHabitProgress.update(ordering.keys, ordering.values)
      progresses.each do |progress|
        progress.is_active = progress.queue_position == 1
        progress.cancel_texting unless progress.is_active
        progress.activate_texting(true, true) if progress.is_active && progress.sidekiq_job_id.blank?
        progress.save!
      end
      HelpToHabit.logger.info "#{current_user.email} modified queue order"
      render json: { message: 'Queue order updated' }, status: :ok
    rescue => e
      render json: { message: 'Failed to update queue order', errors: e.message }, status: :internal_server_error
    end
  end

  def update_user_password
    data = JSON.parse(request.body.read)
    user = User.find(data['id'])

    unless user
      render json: { message: "User not found" }, status: :not_found
      return
    end

    if user.valid_password?(data['current_password'])
      update_params = {
        password: data['password'],
        password_confirmation: data['password_confirmation']
      }

      if user.update(update_params)
        sign_in(user)

        # Render a JSON response for success and include the user's updated information if needed
        render json: { message: "Password updated!", user: user }, status: :ok
      else
        render json: user.errors, status: :unprocessable_entity
      end
    else
      render json: { message: "Current password is incorrect!" }, status: :unprocessable_entity
    end
  end

  def update_user_data
    data = JSON.parse(request.body.read)
    user = User.find(data['id'])

    user.user_data = data["user_data"].presence

    user.skip_reconfirmation!
    user.save!

    render json: { message: "Updated User" }, status: :ok
  end

  def update_user
    user = User.find(user_params[:id])

    if user_params[:email].present?
      email = user_params[:email]&.strip
      email.downcase!
      if User.exists?(email: email) && user.email != email
        render json: { message: "Email already exists" }, status: :bad_request
        return
      end

      user.email = email
    end

    if user_params[:settings].present?
      user.settings = JSON.parse(user_params[:settings])
    end

    if user_params[:first_name].present?
      user.profile.first_name = user_params[:first_name]
    end

    if user_params[:last_name].present?
      user.profile.last_name = user_params[:last_name]
    end

    if user_params[:opt_in].present?
      user.profile.opt_in = user_params[:opt_in]
    end

    # Handle image upload
    if user_params[:remove_avatar] == 'true'
      user.profile.remove_avatar!
    elsif user_params[:avatar].present?
      # You don't need to manually decode the image data since Rails automatically handles this
      user.profile.avatar = user_params[:avatar]
    end

    user.skip_reconfirmation!
    user.save!

    render json: { message: "Updated User" }, status: :ok
  end

  def user_access_data
    user_invite = current_user.user_invite
    has_unlimited_invite = user_invite&.unlimited?
    unlimited_invite_expiration = user_invite&.expires_at

    initial_purchase = current_user.manual_purchase_data
    initial_purchase_expiration = initial_purchase&.sold_at ? (initial_purchase.sold_at + 1.year).strftime('%B %d, %Y') : nil

    subscription = current_user.renewal_data

    expiration_text = nil

    # Initialize Variables
    plan = ""
    plan_description = ""
    plan_description_2 = ""
    action = ""
    upcoming_action_description = nil
    upcoming_action_date = nil

    # Reused Values
    free_plan = "Free"
    full_access_plan = "Full Access"

    free_plan_description = "Access to the 5 Foundational videos and it's contents."
    full_access_plan_description = "Annual access to all courses, behaviors, and content."

    purchase_action = "Purchase"
    subscribe_action = "Subscribe"
    renewal_action = "Renew"
    cancel_action = "Cancel"

    # Logic to determine description and route based on conditions provided
    if !initial_purchase && !has_unlimited_invite
      plan = free_plan
      plan_description = free_plan_description
      plan_description_2 = "Ready to jumpstart your growth? Take advantage of the full suite of Admired Leadership courses and content for a one-time investment of $1,000."
      action = purchase_action
    elsif (initial_purchase || has_unlimited_invite) && !subscription
      plan = full_access_plan
      plan_description = full_access_plan_description
      plan_description_2 = "Keep building on your success. Set up automatic subscription renewal to retain access to Admired Leadership resources for just $200 annually."
      action = subscribe_action
      upcoming_action_description = "Expires on: #{unlimited_invite_expiration ? unlimited_invite_expiration.strftime('%B %d, %Y') : initial_purchase_expiration}"
      upcoming_action_date = unlimited_invite_expiration ? unlimited_invite_expiration.strftime('%B %d, %Y') : initial_purchase_expiration
    elsif subscription && ['inactive', 'expired', 'canceled'].include?(subscription['status'])
      plan = full_access_plan
      plan_description = full_access_plan_description
      plan_description_2 = "Keep building on your success. Set up automatic subscription renewal to retain access to Admired Leadership resources for just $200 annually."
      action = renewal_action
      upcoming_action_description = "Expired on: #{Time.at(subscription['current_period_end']).strftime('%B %d, %Y')}"
      upcoming_action_date = Time.at(subscription['current_period_end']).strftime('%B %d, %Y')
    elsif subscription && subscription['status'] == 'trialing' && !subscription['cancel_at_period_end']
      plan = full_access_plan
      plan_description = full_access_plan_description
      plan_description_2 = "Congratulations! You’re taking advantage of full access to Admired Leadership courses, resources, and community."
      action = cancel_action
      upcoming_action_description = "Next Payment: $200.00 on #{Time.at(subscription['trial_end']).strftime('%B %d, %Y')}"
      upcoming_action_date = Time.at(subscription['trial_end']).strftime('%B %d, %Y')
    elsif subscription && subscription['status'] == 'active' && !subscription['cancel_at']
      plan = full_access_plan
      plan_description = full_access_plan_description
      plan_description_2 = "Congratulations! You’re taking advantage of full access to Admired Leadership courses, resources, and community."
      action = cancel_action
      upcoming_action_description = "Next Payment: $200.00 on #{Time.at(subscription['current_period_end']).strftime('%B %d, %Y')}"
      upcoming_action_date = Time.at(subscription['current_period_end']).strftime('%B %d, %Y')
    elsif subscription && (subscription['status'] == 'active' || subscription['status'] == 'trialing') && subscription['cancel_at']
      plan = full_access_plan
      plan_description = full_access_plan_description
      plan_description_2 = "Keep building on your success. Set up automatic subscription renewal to retain access to Admired Leadership resources for just $200 annually."
      action = renewal_action
      upcoming_action_description = "Ends on: #{Time.at(subscription['current_period_end']).strftime('%B %d, %Y')}"
      upcoming_action_date = Time.at(subscription['current_period_end']).strftime('%B %d, %Y')
    end

    render json: {
      plan: plan,
      plan_description: plan_description,
      plan_description_2: plan_description_2,
      action: action,
      upcoming_action_description: upcoming_action_description,
      upcoming_action_date: upcoming_action_date,
      subscription_data: subscription
    }, status: :ok
  end

  def cancel_subscription
    @subscription_order.update(status: 'paused')
    render json: { message: 'Your subscription' }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def process_resubscription
    @subscription_order.update(status: 'resubscribed')
    render json: { message: 'Subscription has been resubscribed' }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def podcast_cta
    hubspot_service = HubspotService.new(current_user)
    hubspot_service.podcast_cta(current_user)
    render json: { message: "Get Links" }, status: :ok
  end

  def watch_params
    params.require(:user_behavior).permit(:behavior_id, :status)
  end

  def user_params
    params.require(:user).permit(:id, :email, :first_name, :last_name, :opt_in, :remove_avatar, :avatar, :settings)
  end

  def h2h_params
    params.require(:help_to_habit).permit(:time_zone, :phone, :reorder => {})
  end

  def user_password_params
    params.require(:user).permit(:id, :current_password, :password, :password_confirmation)
  end

  private

  def set_subscription_order
    @subscription_order = current_user.subscription_orders.first # Assuming you have a direct association like this
    unless @subscription_order
      render json: { error: 'Subscription order not found' }, status: :not_found
    end
  end

  def initialize_twilio_service
    @twilio_service = TwilioService.new(current_user)
  end

  def check_progress_limit
    if current_user.help_to_habit_progresses.where.not(completed: true).count >= 3
      render json: { message: "You've reached the maximum amount of queues of 3.", status: "maximum_reached" }, status: :ok
      return true
    else
      return false
    end
  end
end
