class CreateCurriculumBehaviorMaps < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_behavior_maps do |t|
      t.references :behavior, foreign_key: { to_table: :curriculum_behaviors }
      t.text :description
      t.string :image
      t.integer :position

      t.timestamps
    end
  end
end
