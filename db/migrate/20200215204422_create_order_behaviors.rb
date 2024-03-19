class CreateOrderBehaviors < ActiveRecord::Migration[6.0]
  def change
    create_table :order_behaviors do |t|
      t.references :order, null: false, foreign_key: true
      t.references :behavior, null: false, foreign_key: { to_table: :curriculum_behaviors }

      t.timestamps
    end
  end
end
