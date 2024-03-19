class CreateCurriculumWebinars < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_webinars do |t|
      t.string :audio_uuid
      t.string :player_uuid
      t.string :title
      t.string :subtitle
      t.text :description
      t.string :slug
      t.float :video_length

      t.timestamps
    end
  end
end
