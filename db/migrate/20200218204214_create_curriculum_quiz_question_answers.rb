class CreateCurriculumQuizQuestionAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :curriculum_quiz_question_answers do |t|
      t.references :quiz_question, null: false, foreign_key: { to_table: :curriculum_quiz_questions }
      t.text :content
      t.integer :status, default: 0
      t.integer :position

      t.timestamps
    end
  end
end
