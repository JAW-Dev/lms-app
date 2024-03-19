class CreateCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_behaviors do |t|
      t.references :course, index: true, foreign_key: { to_table: :curriculum_courses }
      t.string :title
      t.text :description
      t.string :poster
      t.string :slug
      t.integer :position

      t.timestamps
    end
  end
end
