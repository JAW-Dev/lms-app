class AddSidekiqJobIdToHelpToHabitProgress < ActiveRecord::Migration[6.1]
  def change
    add_column :help_to_habit_progresses, :sidekiq_job_id, :string
  end
end