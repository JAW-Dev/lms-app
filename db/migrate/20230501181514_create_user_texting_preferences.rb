class CreateUserTextingPreferences < ActiveRecord::Migration[6.0]
  def change
    create_table :user_texting_preferences do |t|
      t.references :user, null: false, foreign_key: true
      t.boolean :enabled, default: true
      t.string :time_of_day

      t.timestamps
    end
  end
end
