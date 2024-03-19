class Curriculum::WebinarsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_webinar, only: [:show]
  load_and_authorize_resource class: 'Curriculum::Webinar'

  def index
    @upcoming = Curriculum::Webinar.upcoming
    @next_up = @upcoming.first
    @past = Curriculum::Webinar.past

    respond_to do |format|
      format.html
      format.json { render json: { upcoming: @upcoming, next_up: @next_up, past: @past } }
    end
  end

  def show
    # @media_type = params[:media_type]
    @webinar = Curriculum::Webinar.friendly.find(params[:id])

    respond_to do |format|
      format.html
      format.json { render json: @webinar }
    end
  end

  def new
    @room = params[:id]
    @password = params[:pwd]
    options = {
      meeting_number: @room,
      role: 0,
      api_key: Rails.application.credentials.dig(:zoom, :api_key),
      api_secret: Rails.application.credentials.dig(:zoom, :secret)
    }
    @signature = ZoomService.get_signature(options)
  end

  private

  def set_webinar
    @webinar = Curriculum::Webinar.friendly.find(params[:id])
  end
end
