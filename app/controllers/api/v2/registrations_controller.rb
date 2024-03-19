class Api::V2::RegistrationsController < ApiController
  def create
    request.body.rewind
    if User.exists?(email: params[:email])
      render json: { error: true, message: "A user with this email already exists." }, status: :unprocessable_entity
    else
      @user = User.new(user_params.merge(access_type: "direct_access"))
      if @user.save
        # Use RegistrationService to complete the registration process
        registrar = RegistrationService.new(@user)
        # Here, you'd add any additional logic for invites, gifts, etc.
        # Then, you can render the user or some success message
        render json: { success: true, message: "Please check for a conformation email to continue."  }, status: :created
      else
        render json: { error: true, errors: @user.errors }, status: :unprocessable_entity
      end
    end
  end

  private

  def user_params
    params.permit(
      :email,
      profile_attributes: [
        :first_name,
        :last_name,
        :phone,
        :company,
        hubspot: [:what_inspired_you_to_buy_admired_leadership_]
      ]
    )
  end
end
