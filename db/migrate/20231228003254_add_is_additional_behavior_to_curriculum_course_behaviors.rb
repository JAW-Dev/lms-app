class AddIsAdditionalBehaviorToCurriculumCourseBehaviors < ActiveRecord::Migration[6.1]
  def change
    add_column :curriculum_course_behaviors, :is_additional_behavior, :boolean, default: false
  end
end
