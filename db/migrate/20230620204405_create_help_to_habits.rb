class CreateHelpToHabits < ActiveRecord::Migration[6.0]
  def change
    create_table :help_to_habits do |t|
      t.text :content
      t.integer :order
      t.references :curriculum_behavior, null: false, foreign_key: true

      t.timestamps
    end
  end
end
