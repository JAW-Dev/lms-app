class CreateHelpToHabitProgresses < ActiveRecord::Migration[6.1]
  def change
    create_table :help_to_habit_progresses do |t|
      t.references :user, null: false, foreign_key: true
      t.references :curriculum_behavior, null: false, foreign_key: true
      t.integer :progress
      t.boolean :is_active

      t.timestamps
    end
  end
end
