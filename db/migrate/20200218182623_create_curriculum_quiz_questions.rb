class CreateCurriculumQuizQuestions < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_quiz_questions do |t|
      t.references :quiz, null: false, foreign_key: { to_table: :curriculum_quizzes }
      t.text :content
      t.integer :position

      t.timestamps
    end
  end
end
