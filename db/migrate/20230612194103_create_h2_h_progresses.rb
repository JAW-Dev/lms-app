class CreateH2HProgresses < ActiveRecord::Migration[6.1]
  def change
    create_table :h2_h_progresses do |t|
      t.references :users, null: false, foreign_key: true
      t.references :curriculum_behaviors, null: false, foreign_key: true
      t.integer :progress
      t.boolean :isActive

      t.timestamps
    end
  end
end
