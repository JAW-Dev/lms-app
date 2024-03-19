class AddCompanyNameToProfile < ActiveRecord::Migration[6.0]
  def change
    add_column :profiles, :company_name, :string
  end
end
