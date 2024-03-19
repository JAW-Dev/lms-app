class UpdateCurriculumExercises < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_exercises, :description, :text
    add_column :curriculum_exercises, :image, :string
    remove_column :curriculum_exercises, :title, :string
    remove_column :curriculum_exercises, :slug, :string
  end
end
