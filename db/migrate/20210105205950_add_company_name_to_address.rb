class AddCompanyNameToAddress < ActiveRecord::Migration[6.0]
  def change
    add_column :addresses, :company_name, :string
  end
end
