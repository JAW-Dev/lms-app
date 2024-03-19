class AddEnabledToCurriculumCourses < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_courses, :enabled, :boolean, default: false
  end
end
