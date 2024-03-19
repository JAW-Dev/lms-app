class Curriculum::StudyGroupsController < ApplicationController
  before_action :authenticate_user!

  include HighVoltage::StaticPage

  def show
    if user_signed_in? && request.query_parameters.blank?
      return(
        redirect_to curriculum_resources_study_groups_path(
                      firstname: current_user.profile.first_name,
                      email: current_user.email
                    )
      )
    end
    super
  end
end
