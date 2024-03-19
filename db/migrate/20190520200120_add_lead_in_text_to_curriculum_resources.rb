class AddLeadInTextToCurriculumResources < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_resources, :lead_in, :text
  end
end
