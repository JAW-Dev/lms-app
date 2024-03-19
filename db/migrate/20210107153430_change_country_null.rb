class ChangeCountryNull < ActiveRecord::Migration[6.0]
  def change
    change_column_null :addresses, :country_id, true
  end
end
