class CreateCurriculumExamples < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_examples do |t|
      t.references :behavior, foreign_key: { to_table: :curriculum_behaviors }
      t.integer :position
      t.text :description

      t.timestamps
    end
  end
end
