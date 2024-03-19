class RemoveCurriculumTasks < ActiveRecord::Migration[6.0]
  def change
    drop_table :curriculum_tasks do |t|
      t.references :exercise, foreign_key: { to_table: :curriculum_exercises }
      t.string :name
      t.string :slug
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
