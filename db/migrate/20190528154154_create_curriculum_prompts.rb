class CreateCurriculumPrompts < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_prompts do |t|
      t.references :task, foreign_key: { to_table: :curriculum_tasks }
      t.string :title
      t.text :response
      t.integer :position

      t.timestamps
    end
  end
end
