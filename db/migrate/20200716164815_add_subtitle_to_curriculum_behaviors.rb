class AddSubtitleToCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_behaviors, :subtitle, :string
  end
end
