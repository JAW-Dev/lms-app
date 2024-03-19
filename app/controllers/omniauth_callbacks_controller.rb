class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  skip_forgery_protection only: :saml

  def saml
    auth = request.env['omniauth.auth']
    @user = User.from_omniauth(auth)
    is_new_user = @user.nil?
    @user ||= User.create_from_omniauth(auth)

    if @user.persisted?
      if is_new_user
        session[:resource_id] = @user.id
        redirect_to user_confirmed_url
      else
        sign_in_and_redirect @user, event: :authentication
      end
      if is_navigational_format?
        set_flash_message(
          :notice,
          :success,
          kind: helpers.omniauth_provider_name(:saml)
        )
      end
    else
      redirect_to new_user_registration_url
    end
  end
end
