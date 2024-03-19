class DropContacts < ActiveRecord::Migration[6.0]
  def change
    drop_table :contacts do |t|
      t.string :name
      t.string :email
      t.text :content

      t.timestamps
    end
  end
end
