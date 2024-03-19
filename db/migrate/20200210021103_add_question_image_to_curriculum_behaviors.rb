class AddQuestionImageToCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_behaviors, :question_image, :string
  end
end
