class CreateUserBehaviors < ActiveRecord::Migration[6.0]
  def change
    create_table :user_behaviors do |t|
      t.references :user, foreign_key: true
      t.references :behavior, foreign_key: { to_table: :curriculum_behaviors }
      t.integer :status

      t.timestamps
    end
  end
end
