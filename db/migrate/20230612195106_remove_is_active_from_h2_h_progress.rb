class RemoveIsActiveFromH2HProgress < ActiveRecord::Migration[6.1]
  def change
    remove_column :h2_h_progresses, :isActive, :boolean
  end
end
