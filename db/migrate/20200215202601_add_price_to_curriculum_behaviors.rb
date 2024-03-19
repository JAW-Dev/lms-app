class AddPriceToCurriculumBehaviors < ActiveRecord::Migration[6.0]
  def change
    add_monetize :curriculum_behaviors, :price
  end
end
