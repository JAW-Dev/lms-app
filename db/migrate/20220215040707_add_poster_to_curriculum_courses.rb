class AddPosterToCurriculumCourses < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_courses, :poster, :string
  end
end
