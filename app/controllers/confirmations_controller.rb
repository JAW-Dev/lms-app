class ConfirmationsController < Devise::ConfirmationsController
  def redirect
    resource_id = session[:resource_id]
    resource = resource_class.find(resource_id)
    if resource&.confirmed?
      redirect_to after_confirmation_path_for(resource_name, resource)
    else
      redirect_to new_user_registration_url
    end
  end

  def after_confirmation_path_for(resource_name, resource)
    sign_in(resource)

    hubspot = HubspotService.new(resource)
    registrar = RegistrationService.new(resource)

    invitation = UserInvite.find_by_email(resource.email)
    if invitation.present?
      if invitation.expired?
        registrar.revoke_invitation(invitation)
        hubspot.update_contact if Rails.configuration.features.dig(:hubspot)
      elsif invitation.pending?
        registrar.process_invitation(invitation)
        flash[:notice] = I18n.t('devise.confirmations.confirmed_full')
        flash[:alert] = nil
      end
    else
      resource.profile.access_type = '5 Free Videos'
      resource.save
    end

    curriculum_course_path(Curriculum::Course.intro, confirmed: true)
  end

  def after_resending_confirmation_instructions_path_for(resource_name)
    root_path
  end
end
