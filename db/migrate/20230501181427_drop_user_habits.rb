class DropUserHabits < ActiveRecord::Migration[6.1]
  def up
    drop_table :user_habits
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
