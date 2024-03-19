class Curriculum::NotesController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token, if: -> { request.format.js? }
  before_action :set_behavior, only: [:create]

  def index
    @courses =
      (
        current_user.enrolled_courses.to_a +
          current_user.gifted_behaviors.flat_map(&:courses)
      ).uniq.sort_by { |course| course.position }
  end

  def create
    @note = Curriculum::Note.new(note_params)
    @note.user = current_user
    @note.notable = @curriculum_behavior
    if @note.save
      render status: :ok, json: { updated_at: @note.updated_at }
    else
      render status: :bad_request, json: { message: 'Error creating note.' }
    end
  end

  def update
    @note = Curriculum::Note.find params[:id]
    if @note.update(note_params)
      render status: :ok, json: { updated_at: @note.updated_at }
    else
      render status: :bad_request, json: { message: 'Error updating note.' }
    end
  end

  private

  def set_behavior
    @curriculum_behavior = Curriculum::Behavior.find params[:behavior_id]
  end

  def note_params
    params.require(:curriculum_note).permit(:content)
  end
end
