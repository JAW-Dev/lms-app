class CreateUserHabits < ActiveRecord::Migration[6.0]
  def change
    create_table :user_habits do |t|
      t.references :user, null: false, foreign_key: true
      t.references :curriculum_behavior_map, null: false, foreign_key: true
      t.boolean :active, default: false

      t.timestamps
    end
  end
end
