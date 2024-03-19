class PasswordsController < Devise::PasswordsController
  def after_resetting_password_path_for(resource)
    flash[:notice] = 'Your password has been reset.'
    current_user.remove_direct_access
    super
  end
end
