class Curriculum::ExercisesController < ApplicationController
  before_action :authenticate_user!

  def show
    @exercise = Curriculum::Exercise.friendly.find params[:id]
  end
end
