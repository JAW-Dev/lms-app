class UsersController < ApplicationController
  before_action :authenticate_user!, except: [:new]
  before_action :set_user
  protect_from_forgery with: :null_session, only: [:watch]

  def new
    case params[:user_type]
    when 'me'
      return redirect_to root_path if user_signed_in?
      @user = User.new(express_checkout: true)
      if !helpers.disable_signup_question
        hubspot = HubspotService.new(@user)
        @source_options =
          [''] +
            hubspot
              .get_options('what_inspired_you_to_buy_admired_leadership_')
              .map { |o| o['value'] }
      end
      render 'new'
    when 'gift'
      @gift = Gift.friendly.find(params[:g])

      unless params[:is_admin].present?
        if !user_signed_in? && !@gift.redeemed?
          # find or create user from gift recipient email
          @user = User.find_by_email(@gift.recipient_email)
          if !@user
            @user = User.new(email: @gift.recipient_email)
            @user.access_type = :standard_access
            @user.skip_confirmation!
            @user.save
          end

          sign_in(@user)
        end

        if user_signed_in?
          registrar = RegistrationService.new(current_user)
          if @gift.expired?
            registrar.return_gift(@gift)
            return redirect_to '/v2/gift/expired'
          else
            registrar.open_gift(@gift)
          end
        else
          session[:user_return_to] = request.url
          return(
            redirect_to new_user_session_path,
                        alert: I18n.t('devise.failure.unauthenticated')
          )
        end
      end

      @course = @gift.order.courses.first
      @behavior = @gift.order.behaviors.first
      render 'gift', layout: 'layouts/landing'
    when 'direct'
      @user = User.new(access_type: :direct_access)
      if !helpers.disable_signup_question
        hubspot = HubspotService.new(@user)
        @source_options =
          [''] +
            hubspot
              .get_options('what_inspired_you_to_buy_admired_leadership_')
              .map { |o| o['value'] }
      end
      render 'direct'
    when 'team'
      render 'team'
    when 'nonprofit'
      render 'nonprofit'
    else
      flash.now[:notice] = 'Become the Kind of Leader Who Makes People Better'
      render 'path'
    end
  end

  def edit; end

  def update
    respond_to do |format|
      if @user.update(user_params)
        begin
          if @user.payment_method_id.present?
            PaymentService.new.add_payment_method(
              @user.payment_method_id,
              @user.customer_id
            )
          end
          format.json do
            return(
              render status: :ok,
                     json: {
                       success: true,
                       message: 'Payment method added.'
                     }
            )
          end
        rescue PaymentError => e
          return(
            render status: :bad_request, json: { success: false, message: e }
          )
        end

        begin
          if @user.remove_payment_method.present?
            PaymentService.new.remove_payment_method(
              @user.remove_payment_method
            )
          end
          format.json do
            return(
              render status: :ok,
                     json: {
                       success: true,
                       message: 'Payment method removed.'
                     }
            )
          end
        rescue PaymentError => e
          return(
            render status: :bad_request, json: { success: false, message: e }
          )
        end

        format.html do
          redirect_to user_profile_path,
                      notice: 'Your information was updated successfully.'
        end
        format.json { render status: :ok, json: { message: 'User updated.' } }
      else
        format.html { render :edit }
        format.json do
          render status: :bad_request, json: { message: 'Error updating user.' }
        end
      end
    end
  end

  def watch
    begin
      behavior = Curriculum::Behavior.friendly.find watch_params[:behavior_id]
      view = UserBehavior.find_or_create_by(user: @user, behavior: behavior)
      view.update(status: watch_params[:status])
      render status: :ok, json: { status: view.status }
    rescue StandardError
      render status: :bad_request, json: { message: 'Error updating view.' }
    end
  end

  private

  def set_user
    @user = current_user
  end

  def user_params
    params
      .require(:user)
      .permit(
        :email,
        :time_zone,
        :payment_method_id,
        :remove_payment_method,
        profile_attributes: %i[
          id
          first_name
          last_name
          avatar
          remove_avatar
          opt_in
          company_name
          phone
        ]
      )
  end

  def watch_params
    params.permit(:behavior_id, :status, :format, user: {})
  end
end
