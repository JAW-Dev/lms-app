class RemoveCourseReferenceFromBehaviors < ActiveRecord::Migration[6.0]
  def change
    remove_reference :curriculum_behaviors, :course, index: true
  end
end
