class AddDiscountCentsToUserInvite < ActiveRecord::Migration[6.0]
  def change
    add_column :user_invites, :discount_cents, :integer, default: 0, null: false
  end
end
