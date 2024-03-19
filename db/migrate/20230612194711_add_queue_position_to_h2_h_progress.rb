class AddQueuePositionToH2HProgress < ActiveRecord::Migration[6.1]
  def change
    add_column :h2_h_progresses, :queue_position, :integer
  end
end
