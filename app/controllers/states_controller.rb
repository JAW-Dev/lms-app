class StatesController < ApplicationController
  def index
    country =
      if params[:country]
        Country.find_by_alpha2(params[:country])
      else
        Country.find_by_alpha2('US')
      end
    @states = State.where(country: country).order(name: :asc)
  end
end
