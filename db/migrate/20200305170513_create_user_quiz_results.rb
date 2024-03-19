class CreateUserQuizResults < ActiveRecord::Migration[6.0]
  def change
    create_table :user_quiz_results do |t|
      t.references :user, null: false, foreign_key: true
      t.references :quiz, null: false, foreign_key: { to_table: :curriculum_quizzes }
      t.float :score

      t.timestamps
    end
  end
end
