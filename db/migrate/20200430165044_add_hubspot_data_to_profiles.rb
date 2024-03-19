class AddHubspotDataToProfiles < ActiveRecord::Migration[6.0]
  def change
    add_column :profiles, :hubspot, :jsonb, default: {}
  end
end
