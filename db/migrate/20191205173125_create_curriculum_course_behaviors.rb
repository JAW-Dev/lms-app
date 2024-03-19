class CreateCurriculumCourseBehaviors < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_course_behaviors do |t|
      t.references :course, null: false, foreign_key: { to_table: :curriculum_courses }
      t.references :behavior, null: false, foreign_key: { to_table: :curriculum_behaviors }
      t.integer :position

      t.timestamps
    end
  end
end
