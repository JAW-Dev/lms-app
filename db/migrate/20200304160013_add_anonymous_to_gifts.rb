class AddAnonymousToGifts < ActiveRecord::Migration[6.0]
  def change
    add_column :gifts, :anonymous, :boolean, default: false
  end
end
