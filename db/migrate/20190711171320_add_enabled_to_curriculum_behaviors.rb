class AddEnabledToCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_behaviors, :enabled, :boolean, default: false
  end
end
