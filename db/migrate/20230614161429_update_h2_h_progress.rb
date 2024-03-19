class UpdateH2HProgress < ActiveRecord::Migration[6.1]
  def change
    remove_column :h2_h_progresses, :queue_position, :integer
    add_column :h2_h_progresses, :is_active, :boolean, default: false
  end
end
