class CreateOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :orders do |t|
      t.references :user, foreign_key: true
      t.references :course, foreign_key: { to_table: :curriculum_courses }
      t.string :transaction_id
      t.string :processor
      t.integer :status, default: 0
      t.integer :qty, default: 1
      t.monetize :subtotal
      t.monetize :sales_tax
      t.datetime :sold_at
      t.text :notes
      t.string :slug

      t.timestamps
    end
  end
end
