class CreateHelpToHabitExtras < ActiveRecord::Migration[6.1]
  def change
    create_table :help_to_habit_extras do |t|
      t.references :curriculum_behavior, null: false, foreign_key: true
      t.text :content
      t.integer :placement

      t.timestamps
    end

    add_index :help_to_habit_extras, [:curriculum_behavior_id, :placement], unique: true, name: 'index_h2h_extras_on_curriculum_behavior_id_and_placement'
  end
end
