class AddNameToUserInvites < ActiveRecord::Migration[6.0]
  def change
    add_column :user_invites, :name, :string
  end
end
