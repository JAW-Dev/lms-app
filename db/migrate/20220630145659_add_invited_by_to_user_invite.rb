class AddInvitedByToUserInvite < ActiveRecord::Migration[6.0]
  def change
    add_reference :user_invites, :invited_by, foreign_key: { to_table: :users }
  end
end
