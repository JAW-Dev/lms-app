class AddImageToCurriculumBundles < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_bundles, :image, :string
  end
end
