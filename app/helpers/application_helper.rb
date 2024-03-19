module ApplicationHelper
  include Pagy::Frontend

  def is_active_controller(controller_name)
    params[:controller] == controller_name
  end

  def error_details(status)
    case status
    when 404
      'That resource could not be found.'
    when 500
      'There was an error processing your request.'
    else
      'Unknown error. Please contact us for assistance.'
    end
  end

  def hash_to_data(hash)
    return '' if hash.blank?
    hash.map { |k, v| "data-#{k}=\"#{v}\"" }.join(' ').html_safe
  end

  def default_full_access
    Rails.configuration.features.dig(:options)&.dig(:default_full_access)
  end

  def default_full_access_invitation_length
    invitation_length_option =
      Rails
        .configuration
        .features
        .dig(:options)
        &.dig(:default_full_access_invitation_length)
    invitation_length_valid =
      /^\d+\.(day|week|month|year)s?$/.match? invitation_length_option
    invitation_length =
      invitation_length_valid ? eval(invitation_length_option) : 1.year
    invitation_length
  end

  def disable_signup_question
    Rails.configuration.features.dig(:options)&.dig(:disable_signup_question)
  end

  def devise_mapping
    Devise.mappings[:user]
  end

  def resource_name
    devise_mapping.name
  end

  def resource_class
    devise_mapping.to
  end

  def omniauth_provider_name(provider)
    name = provider.to_s
    ENV["#{name.upcase}_PROVIDER_DISPLAY_NAME"].presence || name
  end
end
