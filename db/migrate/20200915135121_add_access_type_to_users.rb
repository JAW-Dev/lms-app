class AddAccessTypeToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :access_type, :integer, default: 0
  end
end
