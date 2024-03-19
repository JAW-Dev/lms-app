class RemoveResponseFromCurriculumPrompts < ActiveRecord::Migration[6.0]
  def change
    remove_column :curriculum_prompts, :response
  end
end
