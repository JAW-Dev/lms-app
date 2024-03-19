class CreateCurriculumNotes < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_notes do |t|
      t.references :behavior, foreign_key: { to_table: :curriculum_behaviors }
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
