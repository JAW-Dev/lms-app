class CreateCurriculumCourses < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_courses do |t|
      t.string :title
      t.text :description
      t.string :poster
      t.string :slug, index: { unique: true }

      t.timestamps
    end
  end
end
