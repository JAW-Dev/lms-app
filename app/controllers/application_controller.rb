class ApplicationController < ActionController::Base
  include Pres::Presents
  helper_method :present

  around_action :set_time_zone, if: :current_user
  before_action :store_user_location!, if: :storable_location?
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_alerts
  before_action :direct_access_reroute, if: :user_is_direct_access
  before_action :redirect_based_on_beta_access


  rescue_from CanCan::AccessDenied do |exception|
    Rails
      .logger.debug "Access denied on #{exception.action} #{exception.subject.inspect}"
    respond_to do |format|
      format.json { head :forbidden, content_type: 'text/html' }
      format.html { redirect_to main_app.root_url, alert: exception.message }
      format.js { head :forbidden, content_type: 'text/html' }
    end
  end

  protected

  def set_time_zone(&block)
    begin
      Time.use_zone(current_user.time_zone, &block)
    rescue StandardError
      Time.use_zone('Eastern Time (US & Canada)', &block)
    end
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(
      :sign_up,
      keys: [
        :express_checkout,
        :has_gift,
        :company_rep,
        :account_number,
        :access_type,
        :user_data,
        profile_attributes: [
          :first_name,
          :last_name,
          :avatar,
          :opt_in,
          :opt_out_eop,
          :phone,
          :company_name,
          hubspot: [:what_inspired_you_to_buy_admired_leadership_]
        ],
        company_attributes: %i[
          name
          line_one
          line_two
          city
          state_id
          country_id
          zip
          phone
        ]
      ]
    )
  end

  def storable_location?
    request.get? && is_navigational_format? && !devise_controller? &&
      !request.xhr?
  end

  def store_user_location!
    store_location_for(:user, request.fullpath)
  end

  def set_alerts
    if current_user&.up_for_renewal?
      session[:alert] = :renewal
    else
      session.delete(:alert)
    end
  end

  def omniauth_permitted
    param_required =
      Rails.configuration.features.dig(:options)&.dig(:hide_omniauth_buttons)
    sso_param = request.params[:sso].presence
    !param_required || sso_param
  end

  def set_omniauth_enabled
    @omniauth_enabled =
      devise_mapping.omniauthable? &&
        resource_class.omniauth_providers.present? && omniauth_permitted
  end

  def user_is_direct_access
    current_user && current_user.access_type == "direct_access"
  end

  def direct_access_reroute
    blocked = request.path.include? "program"
    redirect_to "/users/edit" if blocked
    flash[:alert] = "You must set a password to continue. You will be required to use your email and password to login from this point forward."
  end


  def translate_url_to_old_format(path)

    if path&.include?("/v2/program")
      path_parts = path.split("/")
      module_id = path_parts[3]
      behavior_id = path_parts[4]

      # Fetch the course and behavior by their ids
      course = Curriculum::Course.find(module_id)
      behavior = Curriculum::Behavior.find(behavior_id)

      # Construct the old URL format using the course and behavior slugs
      "/program/modules/#{course.slug}/behaviors/#{behavior.slug}"
    else
      path
    end
  end

  def translate_url_to_new_format(path)
    if path&.start_with?("/program/modules")
      path_parts = path.split("/")
      # Check if path_parts has enough elements for course_slug and behavior_slug
      if path_parts.length >= 6
        course_slug = path_parts[3]
        behavior_slug = path_parts[5]

        # Fetch the course and behavior by their slugs
        course = Curriculum::Course.find_by(slug: course_slug)
        behavior = Curriculum::Behavior.find_by(slug: behavior_slug)

        # Construct the new URL format using the course and behavior ids
        "/v2/program/#{course.id}/#{behavior.id}"
      else
        # If path_parts has less than 6 elements, it must be "/program/modules"
        "/v2"
      end
    else
      path
    end
  end


  private

  def redirect_based_on_beta_access
    return unless current_user

    if current_user.has_beta_access?
      if request.path.start_with?("/program/modules")
        new_url = translate_url_to_new_format(request.path)
        redirect_to new_url and return
      end
    else
      if request.path.start_with?("/v2/program")
        old_url = translate_url_to_old_format(request.path)
        redirect_to old_url and return
      elsif request.path.start_with?("/v2")
        redirect_to root_path and return
      end
    end
  end
end
