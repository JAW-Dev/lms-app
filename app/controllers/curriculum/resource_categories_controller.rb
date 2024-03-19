class Curriculum::ResourceCategoriesController < ApplicationController
  def index
    @resource_categories = Curriculum::ResourceCategory.all
  end
end
