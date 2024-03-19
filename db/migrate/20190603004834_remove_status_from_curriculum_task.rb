class RemoveStatusFromCurriculumTask < ActiveRecord::Migration[6.0]
  def change
    remove_column :curriculum_tasks, :status
  end
end
