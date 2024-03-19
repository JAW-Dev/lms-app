class AddStartDateToHelpToHabitProgress < ActiveRecord::Migration[6.1]
  def change
    add_column :help_to_habit_progresses, :start_date, :date
  end
end
