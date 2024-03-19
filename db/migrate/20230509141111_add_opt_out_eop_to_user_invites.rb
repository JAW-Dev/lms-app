class AddOptOutEopToUserInvites < ActiveRecord::Migration[6.1]
  def change
    add_column :user_invites, :opt_out_eop, :boolean, default: false
  end
end
