class CreateCurriculumQuizzes < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_quizzes do |t|
      t.references :course, null: false, foreign_key: { to_table: :curriculum_courses }
      t.text :description

      t.timestamps
    end
  end
end
