class AddH2hOptOutToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :h2h_opt_out, :boolean, default: false, null: false
  end
end
