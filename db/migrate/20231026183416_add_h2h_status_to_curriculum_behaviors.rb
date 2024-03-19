class AddH2hStatusToCurriculumBehaviors < ActiveRecord::Migration[6.1]
  def change
    add_column :curriculum_behaviors, :h2h_status, :integer, default: 0
  end
end
