class AddExpiryFieldsToGifts < ActiveRecord::Migration[6.0]
  def change
    add_column :gifts, :expires_at, :datetime
    add_column :gifts, :valid_for_days, :integer
    add_column :gifts, :expiry_type, :string, default: 'limited'
  end
end
