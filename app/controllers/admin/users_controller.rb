class Admin::UsersController < Admin::AdminController
  include Pagy::Backend
  before_action :set_user, only: %i[show edit update destroy]
  before_action :set_user_invite, only: [:edit]
  before_action :temp_adjust_access_type, only: %i[edit show update]
  load_and_authorize_resource

  # before_action :set_hubspot_contact, only: [:show, :edit]
  after_action :update_user_gift_permission, only: [:update]

  def index
    respond_to do |format|
      format.html do
        @search_term =
          params.dig(:q, :email_or_profile_first_name_or_profile_last_name_cont)
        user_scope =
          params[:confirmed] == 'false' ? User.unconfirmed : User.confirmed
        @q = user_scope.ransack(params[:q])
        @users = @q.result.includes(:profile)
        @pagy, @users = pagy(@users)
      end
      format.csv do
        status = params[:status]&.to_sym || :all
        time = params[:t] || DateTime.now.strftime('%s')
        date_str = DateTime.now.strftime('%Y-%m-%d')
        send_file(
          UserService.export(status: status),
          filename: "users_#{status}_#{date_str}_#{time}.csv"
        )
      end
    end
  end

  def show
    @courses = Curriculum::Course.enabled.order(position: :asc)
  end

  def edit
    @user.build_user_invite unless @user_invite.present?
    @access_types = []
    if Rails.configuration.features.dig(:hubspot)
      hubspot = HubspotService.new(@user)
      @access_types =
        hubspot.get_options('access_type').sort_by { |option| option['label'] }
    end
  end

  def update
    respond_to do |format|
      course_ids = user_params.dig(:user_invite_attributes, :course_ids)
      courses_changed =
        course_ids.present? &&
          (
            @user.user_invite.blank? ||
              course_ids
                .map(&:to_i)
                .difference(@user.user_invite.course_ids)
                .any?
          )

      update_params = user_params
      add_invited_by = current_user.present? && !@user&.user_invite&.invited_by
      if update_params.dig(:user_invite_attributes, :id).present? &&
           add_invited_by
        invited_by = current_user if current_user.present? &&
          !@user.user_invite&.invited_by
        update_params[:user_invite_attributes][:invited_by] = invited_by
      end

      @user.skip_reconfirmation!
      if @user.update(update_params)
        @user.confirm if @user.confirm_user.present?

        user_params[:promoted_roles].each{|role| @user.add_role(role) } if user_params[:promoted_roles].present?

        if @user.user_invite.present?
          if @user.user_invite.skip_email
            RegistrationService.new(@user).process_invitation(@user.user_invite)
          else
            if @user.user_invite.unlimited? ||
                 @user.user_invite.expires_at.blank?
              Messenger.welcome(
                @user.user_invite.email,
                @user.user_invite.name,
                true
              ).deliver_now
            end
            if @user.user_invite.limited? &&
                 @user.user_invite.expires_at.present? &&
                 (
                   @user.user_invite.previous_changes['expires_at'].present? ||
                     courses_changed
                 )
              Messenger.admin_invitation(
                @user.user_invite.email,
                @user.user_invite
              ).deliver_now
            end
          end
        end

        format.html do
          redirect_to admin_users_path, notice: 'User was successfully updated.'
        end
        format.json do
          render status: :ok, json: { confirmed: @user.confirmed? }
        end
      else
        @access_types = []
        if Rails.configuration.features.dig(:hubspot)
          hubspot = HubspotService.new(@user)
          @access_types =
            hubspot
              .get_options('access_type')
              .sort_by { |option| option['label'] }
        end

        format.html { render :edit }
        format.json do
          render status: :bad_request,
                 json: {
                   message: 'Error updating user. Please try again.'
                 }
        end
      end
    end
  end

  def destroy
    @user.destroy
    redirect_to admin_users_path, notice: 'User was successfully deleted.'
  end

  private

  def temp_adjust_access_type
    # Check if user has full access
    has_access =
      @user.course_orders.complete.any? || @user.user_invite&.unlimited? ||
        @user.subscription_orders.complete.any?

    if /@(admiredleadership|crainc).com$/.match?(@user.email)
      @user.profile&.hubspot["access_type"] = "Employee Access"
      @user.save
    end
    
    # Update user profile hubspot properties to reflect correct access_type
    if has_access && !@user.profile&.hubspot["access_type"].present?
      @user.profile&.hubspot["access_type"] = "Annual Access"
      @user.save
    end
  end

  def set_user
    @user = User.friendly.find(params[:id])
  end

  # def set_hubspot_contact
  #   if Rails.configuration.features.dig(:hubspot) && @user.profile.persisted?
  #     hubspot_properties = HubspotService.new(@user).get_contact_properties
  #     hubspot_properties.select{|key, value| @user.profile.respond_to?(key) }.each{|key, value| @user.profile.update_column('hubspot', @user.profile.hubspot.merge({ key => value['value'] })) }
  #   end
  # end

  def set_user_invite
    @user_invite = UserInvite.find_or_initialize_by(email: @user.email)
  end

  def update_user_gift_permission
    if params[:user_roles]
      @user.add_role(:unlimited_gifts)
    else
      @user.remove_role(:unlimited_gifts)
    end
  end

  def user_params
    params
      .require(:user)
      .permit(
        :email,
        :password,
        :company_id,
        :company_rep,
        :confirm_user,
        :user_access_type,
        promoted_roles: [],
        profile_attributes: %i[
          id
          first_name
          last_name
          avatar
          access_type
          source
          source_person
          company_name
          phone
        ],
        user_invite_attributes: [
          :id,
          :expires_at,
          :access_type,
          :skip_email,
          :valid_for_days,
          :discount_cents,
          :user_access_type,
          course_ids: []
        ]
      )
      .tap do |whitelist|
        if params[:user][:user_invite_attributes].present?
          whitelist[:user_invite_attributes][:status] = :pending

          if params[:user][:user_invite_attributes][:expires_at].present?
            expiration_date =
              DateTime.strptime(
                params[:user][:user_invite_attributes][:expires_at],
                '%m/%d/%Y'
              )
            whitelist[:user_invite_attributes][:expires_at] =
              Time
                .zone
                .local_to_utc(expiration_date)
                .strftime('%Y-%m-%dT%l:%M:%S%z')
          end
          if params[:user][:user_invite_attributes][:id].blank?
            whitelist[:user_invite_attributes][:user_id] = params[:id]
            whitelist[:user_invite_attributes][:email] = params[:user][:email]
            whitelist[:user_invite_attributes][:invited_at] =
              Time
                .zone
                .local_to_utc(DateTime.now)
                .strftime('%Y-%m-%dT%l:%M:%S%z')
          end
        end
      end
  end
end
