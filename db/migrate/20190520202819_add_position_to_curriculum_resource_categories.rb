class AddPositionToCurriculumResourceCategories < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_resource_categories, :position, :integer
  end
end
