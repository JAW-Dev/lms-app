class Curriculum::BundlesController < ApplicationController
  before_action :authenticate_user!, except: %i[index show]
  before_action :set_bundle, only: [:show]
  load_and_authorize_resource class: 'Curriculum::Course'

  def show
    @courses = @bundle.bundle_courses.includes(:course).order(position: :asc)
    @next_behavior =
      UserPresenter.new(current_user).next_bundle_behavior(@bundle)
  end

  private

  def set_bundle
    @bundle = Curriculum::Bundle.friendly.find(params[:id])
  end
end
