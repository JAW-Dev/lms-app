class RemoveCompanyNameFromProfile < ActiveRecord::Migration[6.0]
  def change
    remove_column :profiles, :company
  end
end
