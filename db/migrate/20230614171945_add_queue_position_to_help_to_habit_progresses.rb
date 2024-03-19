class AddQueuePositionToHelpToHabitProgresses < ActiveRecord::Migration[6.1]
  def change
    add_column :help_to_habit_progresses, :queue_position, :integer, default: 0
  end
end
