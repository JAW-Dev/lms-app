class AddSubheadingToCurriculumBundles < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_bundles, :subheading, :string
  end
end
