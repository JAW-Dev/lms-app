class CreateCurriculumQuestions < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_questions do |t|
      t.references :behavior, foreign_key: { to_table: :curriculum_behaviors }
      t.integer :position
      t.text :description

      t.timestamps
    end
  end
end
