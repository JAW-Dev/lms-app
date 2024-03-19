class CreateCurriculumBehaviorResources < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_behavior_resources do |t|
      t.references :behavior, foreign_key: { to_table: :curriculum_behaviors }
      t.references :resource, foreign_key: { to_table: :curriculum_resources }

      t.timestamps
    end
  end
end
