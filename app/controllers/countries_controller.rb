class CountriesController < ApplicationController
  def index
    @countries = Country.order(name: :asc)
  end
end
