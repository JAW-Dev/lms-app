class Curriculum::EventsController < ApplicationController
  def index
    @events = Curriculum::Event.all
  end

  def show
    @event = Curriculum::Event.find_by_slug(params[:slug])
    if !@event.present?
      redirect_to curriculum_events_path
    elsif @event.link_url.present?
      redirect_to @event.link_url, allow_other_host: true
    end
  end
end
