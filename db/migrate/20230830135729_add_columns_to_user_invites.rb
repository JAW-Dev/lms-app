class AddColumnsToUserInvites < ActiveRecord::Migration[6.1]
  def change
    add_column :user_invites, :expiration_type, :text
    add_column :user_invites, :length_type, :text
  end
end
