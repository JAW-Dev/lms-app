class AddOptInToProfiles < ActiveRecord::Migration[6.0]
  def change
    add_column :profiles, :opt_in, :boolean, default: false
  end
end
