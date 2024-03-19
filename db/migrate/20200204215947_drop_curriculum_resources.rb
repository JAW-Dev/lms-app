class DropCurriculumResources < ActiveRecord::Migration[6.0]
  def change
    drop_table :curriculum_resources do |t|
      t.references :resource_category, index: true, foreign_key: { to_table: :curriculum_resource_categories }
      t.string :title
      t.string :url
      t.string :attachment
      t.string :slug, index: { unique: true }

      t.timestamps
    end
  end
end
