class CreateUserInviteCourses < ActiveRecord::Migration[6.0]
  def change
    create_table :user_invite_courses do |t|
      t.references :user_invite, null: false, foreign_key: true
      t.references :course, null: false, foreign_key: { to_table: :curriculum_courses }

      t.timestamps
    end
  end
end
