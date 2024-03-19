class AddDefaultVideoLengthToCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    change_column_default :curriculum_behaviors, :video_length, from: nil, to: 0.0
    Curriculum::Behavior.where(video_length: nil).update_all(video_length: 0.0)
  end
end
