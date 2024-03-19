class CreateAddresses < ActiveRecord::Migration[6.0]
  def change
    create_table :addresses do |t|
      t.references :order, null: false, foreign_key: true
      t.string :type
      t.string :line1
      t.string :line2
      t.string :city
      t.references :state, foreign_key: true
      t.references :country, null: false, foreign_key: true
      t.string :zip

      t.timestamps
    end
  end
end
