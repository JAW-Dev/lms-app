class AddExerciseImageToCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_behaviors, :exercise_image, :string
  end
end
