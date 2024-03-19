class RegistrationsController < Devise::RegistrationsController
  before_action :set_omniauth_enabled, only: :new

  def new
    @user = User.new
    if !helpers.disable_signup_question
      hubspot = HubspotService.new(@user)
      @source_options =
        [''] +
          hubspot
            .get_options('what_inspired_you_to_buy_admired_leadership_')
            .map { |o| o['value'] }
    end
    request.variant = determine_variant
    @variant = params[:variant]
    render 'new'
  end

  def create
    request.variant = determine_variant
    super { invite_if_full_access }
  end

  def after_inactive_sign_up_path_for(resource)
    ConfirmationReminderJob
      .set(wait_until: 1.day.from_now)
      .perform_later(resource)
    ConfirmationWarningJob
      .set(wait_until: 3.days.from_now)
      .perform_later(resource)
    welcome_confirm_path
  end

  def after_sign_up_path_for(resource)
    hubspot = HubspotService.new(resource)
    registrar = RegistrationService.new(resource)

    if request.referer
      ref_uri = URI(request.referer)
      query_params = Rack::Utils.parse_nested_query(ref_uri.query)
      if query_params['g'].present?
        gift = Gift.friendly.find(query_params['g'])
        if gift.expired?
          registrar.return_gift(gift)
          hubspot.update_contact if Rails.configuration.features.dig(:hubspot)
          flash[:alert] = 'Gift has expired.'
          return root_path
        else
          registrar.open_gift(gift)
          hubspot.add_giftee(gift) if Rails.configuration.features.dig(:hubspot)
          flash[:notice] =
            'Welcome! Your gift has been applied to your account.'
          flash[:alert] = nil
          return welcome_path(user_type: :gift)
        end
      end
    end

    invitation = UserInvite.find_by_email(resource.email)
    if invitation.present?
      if invitation.expired?
        registrar.revoke_invitation(invitation)
        hubspot.update_contact if Rails.configuration.features.dig(:hubspot)
        return root_path
      elsif invitation.pending?
        registrar.process_invitation(invitation)

        if invitation.user_access_type == "12 Hour Access"
          invitation.expires_at = Time.now + 12.hours
          invitation.save
        end 

        flash[:notice] = 'Welcome! You now have access to all module content.'
        flash[:alert] = nil
        return welcome_path(user_type: :invite)
      end
    end

    if resource.express_checkout.present?
      return new_curriculum_order_path
    else
      resource.profile.access_type = '5 Free Videos'
      resource.save
      flash[:notice] =
        'Welcome! Your five foundational videos are now available.'
      flash[:alert] = nil
      return curriculum_course_path(Curriculum::Course.intro)
    end
  end

  def update_resource(resource, params)
    if resource.standard_access?
      resource.update_with_password(params)
    else
      if params[:password].blank?
        params.delete(:password)
        if params[:password_confirmation].blank?
          params.delete(:password_confirmation)
        end
      end

      result = resource.update(params)
      resource.clean_up_passwords
      current_user.remove_direct_access
      result
    end
  end

  private

  def invite_if_full_access
    if helpers.default_full_access
      now = DateTime.now
      invitation_length = helpers.default_full_access_invitation_length
      if !@user.user_invite.present?
        invite =
          UserInvite.find_by_email(@user.email) || @user.build_user_invite
        invite.update(
          email: @user.email,
          status: :pending,
          user_id: @user.id,
          access_type: :unlimited,
          invited_at: now,
          expires_at: now + invitation_length,
          courses: Curriculum::Course.enabled
        )
        @user.save
      end
    end
  end

  def determine_variant
    helpers.default_full_access ? :full : nil
  end
end
