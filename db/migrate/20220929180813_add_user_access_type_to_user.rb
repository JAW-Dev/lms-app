class AddUserAccessTypeToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :user_access_type, :string
  end
end
