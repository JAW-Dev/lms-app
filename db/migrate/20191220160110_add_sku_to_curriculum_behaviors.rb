class AddSkuToCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_behaviors, :sku, :string
  end
end
