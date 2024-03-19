class AddMessageToGifts < ActiveRecord::Migration[6.0]
  def change
    add_column :gifts, :message, :text
  end
end
