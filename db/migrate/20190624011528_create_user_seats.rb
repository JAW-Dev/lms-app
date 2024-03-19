class CreateUserSeats < ActiveRecord::Migration[6.0]
  def change
    create_table :user_seats do |t|
      t.references :user, foreign_key: true
      t.string :email, index: true
      t.references :order, foreign_key: true
      t.integer :status
      t.datetime :invited_at

      t.timestamps
    end
  end
end
