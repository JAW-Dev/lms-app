class AddReferencesToCompanies < ActiveRecord::Migration[6.0]
  def change
    add_reference :companies, :country, foreign_key: true
    add_reference :companies, :state, foreign_key: true

    remove_column :companies, :state
  end
end
