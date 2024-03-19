class AddPositionToCurriculumCourses < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_courses, :position, :integer

    Curriculum::Course.order(:updated_at).each.with_index(1) do |course, index|
      course.update_column(:position, index)
    end
  end
end
