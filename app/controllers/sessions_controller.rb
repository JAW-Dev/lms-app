class SessionsController < Devise::SessionsController
  before_action :set_omniauth_enabled, only: :new
  before_action :store_redirect_url, only: [:new]

  def after_sign_in_path_for(resource)
    registrar = RegistrationService.new(resource)
    default_path = root_path

    invitation = UserInvite.find_by_email(resource.email)
    registrar.revoke_invitation(invitation) if invitation&.expired?
    if invitation&.pending? && !invitation&.expired?
      registrar.process_invitation(invitation)
      flash[:notice] = 'Welcome! You now have access to all module content.'
      flash[:alert] = nil
    end

    begin
      ref_uri = URI(request.referer)
      query_params = Rack::Utils.parse_nested_query(ref_uri.query)
      if query_params['g'].present?
        gift = Gift.friendly.find(query_params['g'])
        if gift.expired?
          registrar.return_gift(gift)
          flash[:alert] = 'Gift has expired.'
        else
          registrar.open_gift(gift)
          flash[:notice] = 'Your gift has been applied to your account.'
          flash[:alert] = nil
        end
      end

      default_path
    rescue StandardError
      stored_location_for(resource) || default_path
    end
  end

  private

  def store_redirect_url
    session[:redirect_url] = params[:redirectUrl] if params[:redirectUrl].present?
  end

  def after_sign_in_path_for(resource)
    redirect_location = session.delete(:redirect_url)
    stored_location = stored_location_for(resource)
    
    if redirect_location
      redirect_location
    elseif /(program|help-to-habit|get-your-links)/.match?(stored_location)
      stored_location
    else
      root_path
    end
  end
  
end
