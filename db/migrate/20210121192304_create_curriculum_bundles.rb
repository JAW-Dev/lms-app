class CreateCurriculumBundles < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_bundles do |t|
      t.string :name
      t.text :description
      t.boolean :enabled, default: true
      t.string :sku
      t.string :slug
      t.references :company, foreign_key: true

      t.timestamps
    end
  end
end
