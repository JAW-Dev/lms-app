class RemovePositionFromBehaviors < ActiveRecord::Migration[6.0]
  def change
    remove_column :curriculum_behaviors, :position
  end
end
