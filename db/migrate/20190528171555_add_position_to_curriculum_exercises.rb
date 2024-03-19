class AddPositionToCurriculumExercises < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_exercises, :position, :integer

    Curriculum::Exercise.order(:updated_at).each.with_index(1) do |exercise, index|
      exercise.update_column(:position, index)
    end
  end
end
