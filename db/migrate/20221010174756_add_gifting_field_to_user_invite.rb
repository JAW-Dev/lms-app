class AddGiftingFieldToUserInvite < ActiveRecord::Migration[6.0]
  def change
    add_column :user_invites, :unlimited_gifts, :boolean
  end
end
