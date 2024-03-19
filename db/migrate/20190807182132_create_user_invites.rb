class CreateUserInvites < ActiveRecord::Migration[6.0]
  def change
    create_table :user_invites do |t|
      t.integer :status, default: 0
      t.string :email
      t.datetime :invited_at
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
