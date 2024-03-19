class Admin::UserInvitesController < Admin::AdminController
  include Pagy::Backend
  before_action :set_variant, only: %i[index new]
  before_action :set_user_invite, only: %i[update destroy]
  load_and_authorize_resource

  def index
    @invited_by = request.variant.restricted? ? current_user : nil
    @status = params.dig(:q, :status) || 'all'
    @search_term = params.dig(:q, :email_cont)
    if params.dig(:q, :s).blank?
      params[:q] ||= {}
      params[:q][:s] = "invited_at desc"
    end
    @q = UserInvite.invited_by(@invited_by).send(@status).ransack(params[:q])
    @users = @q.result
    @pagy, @users = pagy(@users)
  end

  def new
    @user_invite = UserInvite.new
    @access_types = []
    if Rails.configuration.features.dig(:hubspot)
      hubspot = HubspotService.new(@user)
      @access_types =
        hubspot.get_options('access_type').sort_by { |option| option['label'] }
    end
  end

  def create
    users = user_invite_params[:user_list].split("\n").map(&:strip)
    bad_users = []
    users.each do |user|
      email, name = user.split(',').map(&:strip)
      email.downcase!
      user = User.where('lower(email) = ?', email).first
      invite = UserInvite.find_or_initialize_by(email: email)

      invited_at = DateTime.now
      valid_for_days = user_invite_params[:valid_for_days].presence&.to_i

      invite.name = name
      invite.invited_at = invited_at
      invite.access_type = user_invite_params[:access_type]
      invite.user_access_type = user_invite_params[:user_access_type]
      invite.skip_email = user_invite_params[:skip_email]
      invite.course_ids = user_invite_params[:course_ids]
      invite.message = user_invite_params[:message]
      invite.invited_by = current_user if current_user.present?
      invite.discount_cents =
        user_invite_params[:discount_cents] || invite.discount_cents
      invite.unlimited_gifts = user_invite_params[:unlimited_gifts]
      invite.opt_out_eop = user_invite_params[:opt_out_eop]

      # if user exists, set expires_at date explicitly
      if user.present?
        invite.user = user
        expires_at = invited_at + (valid_for_days || 7).days

        # if user has an invite, set expires_at to the latest value
        if invite.id.present?
          invite.expires_at = [expires_at, invite.expires_at].compact.max
        else
          invite.expires_at = expires_at
        end
      else
        expires_at = user_invite_params[:expires_at]
        invite.valid_for_days = valid_for_days.presence
        invite.expires_at = expires_at.present? ? DateTime.strptime(expires_at, '%m/%d/%Y') : nil
      end

      if invite.save
        RegistrationService.new(user).process_invitation(invite) if user&.id.present? # changed
        unless invite.skip_email
          if invite.unlimited? || invite.expires_at.blank?
            Messenger.welcome(invite.email, invite.name, true, invite.message)
              .deliver_now
          end
          if invite.limited? && invite.expires_at.present?
            Messenger.admin_invitation(invite.email, invite).deliver_now
          end
        end
      else
        bad_users << email
      end
    end
    num_sent = users.size - bad_users.size
    redirect_to admin_user_invites_path,
                notice:
                  "Sent invitations to #{num_sent} #{'user'.pluralize(num_sent)}."
  end

  def update
    respond_to do |format|
      invited_by = current_user if current_user.present? &&
        !@user_invite.invited_by
      update_params = user_invite_params.merge invited_by: invited_by
      if @user_invite.update(update_params)
        if @user_invite.unlimited? || @user_invite.expires_at.blank?
          Messenger.welcome(
            @user_invite.email,
            @user_invite.name,
            true,
            @user_invite.message
          ).deliver_now
        end
        if @user_invite.limited? && @user_invite.invited_at_changed? &&
             @user_invite.expires_at.present?
          Messenger.admin_invitation(@user_invite.email, @user_invite)
            .deliver_now
        end
        format.html do
          redirect_to admin_user_invites_path, notice: 'Invitation resent.'
        end
        format.json do
          render status: :ok, json: { invited_at: @user_invite.invited_at }
        end
      else
        format.html do
          render :admin_user_invites_path,
                 alert: 'Error resending invitation. Please try again.'
        end
        format.json do
          render status: :bad_request,
                 json: {
                   message: 'Error resending invitation. Please try again.'
                 }
        end
      end
    end
  end

  def destroy
    @user_invite.destroy
    respond_to do |format|
      format.html do
        redirect_to admin_user_invites_path,
                    notice: 'Invite was successfully deleted.'
      end
      format.json do
        render status: :ok,
               json: {
                 message: 'Invite was successfully deleted.'
               }
      end
    end
  end

  private

  def set_user_invite
    @user_invite = UserInvite.find(params[:id])
  end

  def user_invite_params
    params
      .require(:user_invite)
      .permit(
        :user_list,
        :invited_at,
        :expires_at,
        :access_type,
        :skip_email,
        :message,
        :valid_for_days,
        :discount_cents,
        :user_access_type,
        :unlimited_gifts,
        :opt_out_eop,
        course_ids: []
      )
  end

  def set_variant
    request.variant = :restricted if !current_user&.has_role?(:manager)
  end
end
