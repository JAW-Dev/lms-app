class Api::V2::Admin::AdminController < ApiController
  before_action :check_admin

  private

  def check_admin
    unless current_user&.has_role?(:admin) || current_user.cra_employee?
      render json: { message: "You are not authorized" }, status: :unauthorized
    end
  end
end
