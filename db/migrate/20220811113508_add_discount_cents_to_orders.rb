class AddDiscountCentsToOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :discount_cents, :integer, default: 0, null: false
  end
end
