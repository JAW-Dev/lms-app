class Api::V1::UsersController < ApiController
  skip_before_action :verify_authenticity_token, if: :json_request?

  def create
    @user = User.find_or_initialize_by(email: user_params[:email])
    return render status: :ok, json: { id: @user.slug } unless @user.new_record?

    @user.profile = Profile.new(opt_in: true)
    @user.access_type = :direct_access

    if @user.save
      render status: :ok, json: { id: @user.slug }
    else
      render status: :bad_request, json: { message: 'Error creating user.' }
    end
  end

  private

  def json_request?
    request.format.json?
  end

  def user_params
    params.require(:user).permit(:email)
  end
end
