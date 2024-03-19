class CreateGifts < ActiveRecord::Migration[6.0]
  def change
    create_table :gifts do |t|
      t.integer :status, default: 0
      t.references :order, null: false, foreign_key: true
      t.string :recipient_email
      t.references :user, foreign_key: true
      t.string :slug

      t.timestamps
    end
  end
end
