class AddVideoLengthToCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_behaviors, :video_length, :float
  end
end
