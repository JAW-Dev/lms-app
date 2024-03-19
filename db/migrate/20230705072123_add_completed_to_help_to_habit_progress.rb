class AddCompletedToHelpToHabitProgress < ActiveRecord::Migration[6.1]
  def change
    add_column :help_to_habit_progresses, :completed, :boolean
  end
end
