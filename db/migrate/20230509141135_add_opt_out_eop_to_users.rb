class AddOptOutEopToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :opt_out_eop, :boolean, default: false
  end
end
