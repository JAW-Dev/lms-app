class CreateStates < ActiveRecord::Migration[6.0]
  def change
    create_table :states do |t|
      t.references :country, foreign_key: true
      t.string :name
      t.string :abbr

      t.timestamps
    end
  end
end
