class RemoveUserTasks < ActiveRecord::Migration[6.0]
  def change
    drop_table :user_tasks do |t|
      t.references :user, foreign_key: true
      t.references :task, foreign_key: { to_table: :curriculum_tasks }
      t.integer :status

      t.timestamps
    end
  end
end
