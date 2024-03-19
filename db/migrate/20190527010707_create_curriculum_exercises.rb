class CreateCurriculumExercises < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_exercises do |t|
      t.references :behavior, foreign_key: { to_table: :curriculum_behaviors }
      t.string :title
      t.string :slug

      t.timestamps
    end
  end
end
