class ChangeScheduledTimeInProfiles < ActiveRecord::Migration[6.1]
  def change
    change_column :profiles, :scheduled_time, :string
  end
end
