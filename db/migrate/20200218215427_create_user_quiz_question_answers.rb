class CreateUserQuizQuestionAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :user_quiz_question_answers do |t|
      t.references :user, null: false, foreign_key: true
      t.references :quiz_question, null: false, foreign_key: { to_table: :curriculum_quiz_questions }
      t.references :quiz_question_answer, null: false, foreign_key: { to_table: :curriculum_quiz_question_answers }

      t.timestamps
    end
  end
end
