class RemoveQuestionImageFromCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    remove_column :curriculum_behaviors, :question_image
  end
end
