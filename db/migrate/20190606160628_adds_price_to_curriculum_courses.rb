class AddsPriceToCurriculumCourses < ActiveRecord::Migration[6.0]
  def change
    add_monetize :curriculum_courses, :price
  end
end
