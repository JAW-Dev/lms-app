class CreateUserPrompts < ActiveRecord::Migration[6.0]
  def change
    create_table :user_prompts do |t|
      t.references :user, foreign_key: true
      t.references :prompt, foreign_key: { to_table: :curriculum_prompts }
      t.text :response

      t.timestamps
    end
  end
end
