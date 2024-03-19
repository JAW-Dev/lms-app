class Api::RegistrationsController < ApiController
  skip_before_action :verify_authenticity_token, only: [:create]
  before_action :authenticate
  wrap_parameters false

  def create
    Rails.logger.info("*******************************")
    Rails.logger.info("Raw request body: #{request.body.read}")
    request.body.rewind
    if User.exists?(email: params[:email])
      render json: { success: false, errors: ["A user with this email already exists."] }, status: :unprocessable_entity
    else
      @user = User.new(user_params.merge(access_type: "direct_access"))
      if @user.save
        # Use RegistrationService to complete the registration process
        registrar = RegistrationService.new(@user)
        # Here, you'd add any additional logic for invites, gifts, etc.
        # Then, you can render the user or some success message
        render json: { success: true}, status: :created
      else
        render json: { success: false, errors: @user.errors }, status: :unprocessable_entity
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

  def authenticate
    authenticate_or_request_with_http_token do |token, options|
      # Compare the tokens in a time-constant manner, to mitigate
      # timing attacks.

      ActiveSupport::SecurityUtils.secure_compare(
        ::Digest::SHA256.hexdigest(token),
        ::Digest::SHA256.hexdigest(Rails.application.credentials.dig(:external_api, :key))
      )
    end
  end
end
