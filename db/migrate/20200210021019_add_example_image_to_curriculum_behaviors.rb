class AddExampleImageToCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_behaviors, :example_image, :string
  end
end
