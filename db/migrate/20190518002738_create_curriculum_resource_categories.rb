class CreateCurriculumResourceCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_resource_categories do |t|
      t.string :name
      t.string :slug, index: { unique: true }

      t.timestamps
    end
  end
end
