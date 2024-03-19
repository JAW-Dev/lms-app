class AddMessageToUserInvites < ActiveRecord::Migration[6.0]
  def change
    add_column :user_invites, :message, :text
  end
end
