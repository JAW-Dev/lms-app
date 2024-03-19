class CreateCurriculumBundleCourses < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_bundle_courses do |t|
      t.references :bundle, null: false, foreign_key: { to_table: :curriculum_bundles }
      t.references :course, null: false, foreign_key: { to_table: :curriculum_courses }
      t.integer :position

      t.timestamps
    end
  end
end
