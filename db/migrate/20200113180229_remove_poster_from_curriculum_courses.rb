class RemovePosterFromCurriculumCourses < ActiveRecord::Migration[6.0]
  def change
    remove_column :curriculum_courses, :poster, :string
  end
end
