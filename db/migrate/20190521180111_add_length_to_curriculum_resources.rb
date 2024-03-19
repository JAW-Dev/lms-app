class AddLengthToCurriculumResources < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_resources, :length, :float, default: 0
  end
end
