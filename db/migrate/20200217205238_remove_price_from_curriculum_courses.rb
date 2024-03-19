class RemovePriceFromCurriculumCourses < ActiveRecord::Migration[6.0]
  def change
    remove_monetize :curriculum_courses, :price
  end
end
