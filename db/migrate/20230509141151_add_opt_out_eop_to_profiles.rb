class AddOptOutEopToProfiles < ActiveRecord::Migration[6.1]
  def change
    add_column :profiles, :opt_out_eop, :boolean, default: false
  end
end
