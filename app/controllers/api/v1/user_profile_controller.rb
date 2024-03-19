class Api::V1::UserProfileController < ApplicationController
    def index
    end

    def create
        user = User.find(user_params[:id])
        render json: user.profile, status: :ok
    end


    private
    def user_params
        params.require(:user).permit(:id)
    end
end