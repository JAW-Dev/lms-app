class Curriculum::ConferencesController < ApplicationController
  include HighVoltage::StaticPage

  def show
    authorize! :view_conference, :subscriber_content
    if user_signed_in? && request.query_parameters.blank?
      return(
        redirect_to conference_path(
                      firstname: current_user.profile.first_name,
                      lastname: current_user.profile.last_name,
                      email: current_user.email
                    )
      )
    end
    super
  end

  private

  def page_finder_factory
    ::ConferencePageFinder
  end
end
