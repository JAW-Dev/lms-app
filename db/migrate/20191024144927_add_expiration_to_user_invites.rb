class AddExpirationToUserInvites < ActiveRecord::Migration[6.0]
  def change
    add_column :user_invites, :expires_at, :datetime
  end
end
