class AddAudioIdToCurriculumBehavior < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_behaviors, :audio_uuid, :string
  end
end
