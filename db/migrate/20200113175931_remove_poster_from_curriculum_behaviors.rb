class RemovePosterFromCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    remove_column :curriculum_behaviors, :poster, :string
  end
end
