class Curriculum::ResourcesController < ApplicationController
  def show
    return render params[:page] if params[:page]
    @resource_category =
      Curriculum::ResourceCategory.find_by_slug(params[:category])
    @resource = Curriculum::Resource.find_by_slug(params[:id])
  end
end
