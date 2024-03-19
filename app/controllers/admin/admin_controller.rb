class Admin::AdminController < ApplicationController
  before_action :authenticate_user!

  def current_ability
    @current_ability ||= AdminAbility.new(current_user)
  end
end
