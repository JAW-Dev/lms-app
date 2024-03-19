class AddUserDataToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :user_data, :json, default: {}
  end
end
