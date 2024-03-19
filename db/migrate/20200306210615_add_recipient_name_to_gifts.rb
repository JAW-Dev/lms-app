class AddRecipientNameToGifts < ActiveRecord::Migration[6.0]
  def change
    add_column :gifts, :recipient_name, :string
  end
end
