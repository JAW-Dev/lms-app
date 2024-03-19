class Admin::StaticController < Admin::AdminController
  before_action :authenticate_user!

  def dashboard; end
end
