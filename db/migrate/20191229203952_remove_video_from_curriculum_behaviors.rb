class RemoveVideoFromCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    remove_column :curriculum_behaviors, :video, :string
  end
end
