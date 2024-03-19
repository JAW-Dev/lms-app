class AddUserAccessTypeToUserInvites < ActiveRecord::Migration[6.0]
  def change
    add_column :user_invites, :user_access_type, :string
  end
end
