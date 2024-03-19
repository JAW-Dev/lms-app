class AddPlayerUuidToCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_behaviors, :player_uuid, :string
  end
end
