class AddScheduledTimeToProfiles < ActiveRecord::Migration[6.1]
  def change
    add_column :profiles, :scheduled_time, :time
  end
end
