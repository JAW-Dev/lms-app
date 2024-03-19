class AddDateToWebinars < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_webinars, :presented_at, :datetime
  end
end
