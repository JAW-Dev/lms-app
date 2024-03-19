class AddNotable < ActiveRecord::Migration[6.0]
  def up
    add_reference :curriculum_notes, :notable, polymorphic: true, index: true

    Curriculum::Note.find_each do |note|
      note.update_columns({notable_id: note.behavior_id, notable_type: "Curriculum::Behavior"})
    end

    remove_reference :curriculum_notes, :behavior, foreign_key: { to_table: :curriculum_behaviors }
  end

  def down
    add_reference :behavior, foreign_key: { to_table: :curriculum_behaviors }

    Curriculum::Note.find_each do |note|
      note.update_column(:behavior_id, note.notable_id)
    end

    remove_reference :curriculum_notes, :notable, polymorphic: true, index: true
  end
end
