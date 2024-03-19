class Api::V1::SessionsController < ApiController
  def create
    @email = user_params[:email]
    if @email.blank?
      return render status: :bad_request, json: { message: 'Error.' }
    end

    @user = User.find_for_authentication(email: @email)
    if @user.blank?
      return(
        render status: :not_found,
               json: {
                 message: 'Invalid email or password.'
               }
      )
    end

    if @user.direct_access?
      Magic::Link::MagicLink.new(email: @email).send_login_instructions
    end
    render status: :ok, json: { access_type: @user.access_type }
  end

  private

  def user_params
    params.require(:user).permit(:email)
  end
end
