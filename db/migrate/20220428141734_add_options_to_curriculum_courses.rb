class AddOptionsToCurriculumCourses < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_courses, :options, :jsonb
  end
end
