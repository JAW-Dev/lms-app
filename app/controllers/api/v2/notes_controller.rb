class Api::V2::NotesController < ApiController
  before_action :set_behavior, only: [:create_note]

  def index
    notes = Curriculum::Note.where(user: current_user)
    modules = Curriculum::Course.all
    formatted_modules = modules.map do |mod|
      {
        id: mod.id,
        title: mod.title,
        behaviors: mod.behaviors.map { |behavior| { id: behavior.id, title: behavior.title } },
      }
    end


    formatted_notes = notes.map do |note|
      {
        id: note.id,
        content: note.content.body.to_s,
        record_id: note.content.record_id,
        created_at: note.created_at,
        updated_at: note.updated_at,
        notable_id: note.notable_id
      }
    end


    # Rearrange notes based on modules and behaviors
    rearranged_notes = []
    formatted_modules.each do |mod|
      mod[:behaviors].each do |behavior|
        notes_for_behavior = formatted_notes.select { |note| note[:notable_id] == behavior[:id] }
        notes_for_behavior.each { |note| note[:module_title] = mod[:title]; note[:behavior_title] = behavior[:title]; note[:module_id] = mod[:id] }
        rearranged_notes.concat(notes_for_behavior)
      end
    end

    render json: { notes: rearranged_notes }, status: :ok
  end

  def create_note
    @note = Curriculum::Note.new(note_params)
    @note.user = current_user
    @note.notable = @curriculum_behavior
    if @note.save
    # Return the created note in the response
    render status: :ok, json: { message: 'Note created', note: @note }
    else
      render status: :bad_request, json: { message: 'Error creating note.', errors: @note.errors.full_messages }
    end
  end

  def update_note
    @note = Curriculum::Note.find params[:id]
    if @note.update(note_update_params)
      render status: :ok, json: { updated_at: @note.updated_at }
    else
      render status: :bad_request, json: { message: 'Error updating note.' }
    end
  end


  def destroy_note
    @note = Curriculum::Note.find params[:id]
    @note.destroy

    render status: :ok, json: { message: 'Note deleted.' }
  end

  def user_note
    note = Curriculum::Note.find_by(notable_id: params[:behavior_id], user: current_user)

    if note
      formatted_note = {
        id: note.id,
        content: note.content.body.to_s,
        record_id: note.content.record_id,
        created_at: note.created_at,
        updated_at: note.updated_at,
        notable_id: note.notable_id
      }

      render json: { note: formatted_note }, status: :ok
    else
      render json: { note: nil }, status: :ok
    end
  end


  def set_behavior
    @curriculum_behavior = Curriculum::Behavior.find params[:behavior_id]
  end

  private

  def note_params
    params.require(:note).permit(:content)
  end

  def note_update_params
    params.require(:note).permit(:content, :id)
  end
end
