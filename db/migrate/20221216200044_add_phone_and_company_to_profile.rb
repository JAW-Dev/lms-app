class AddPhoneAndCompanyToProfile < ActiveRecord::Migration[6.0]
  def change
    add_column :profiles, :phone, :string
    add_column :profiles, :company, :string
  end
end
