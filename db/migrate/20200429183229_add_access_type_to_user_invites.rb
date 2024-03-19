class AddAccessTypeToUserInvites < ActiveRecord::Migration[6.0]
  def change
    add_column :user_invites, :access_type, :integer, default: 0
  end
end
