class CreateCurriculumBundleCourseBehaviors < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_bundle_course_behaviors do |t|
      t.references :bundle_course, null: false, foreign_key: { to_table: :curriculum_bundle_courses }
      t.references :behavior, null: false, foreign_key: { to_table: :curriculum_behaviors }
      t.integer :position

      t.timestamps
    end
  end
end
