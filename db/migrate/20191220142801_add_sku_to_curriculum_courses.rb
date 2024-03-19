class AddSkuToCurriculumCourses < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_courses, :sku, :string
  end
end
