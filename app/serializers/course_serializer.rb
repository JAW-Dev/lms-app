class CourseSerializer
  def initialize(courses, user)
    @courses = courses.where.not(title: 'Additional Behaviors')
    @additional_behavior_course = courses.find_by(title: 'Additional Behaviors')
    @user = user
  end

  def as_json(_options = {})
    courses = @courses.map do |course|
      {
        **course.as_json,
        behaviors: behaviors(course),
        completed: course.completed?(@user),
        enrolled_in: @user.enrolled_in?(course)
      }
    end
    {
      last_viewed: last_viewed,
      modules: courses
    }
  end

  private

  def last_viewed
    last = @user.viewed_behaviors.order(updated_at: :desc).first
    {
      module: last&.behavior&.courses&.first&.id || Curriculum::Course.where(title: 'Foundations').first.id,
      behavior: last ? last.behavior_id : Curriculum::Course.where(title: 'Foundations').first.behaviors.first.id,
      new_user: !last.present?
    }
  end

  def behaviors(course)
    course.behaviors.map do |behavior|
      behavior_append_completed(behavior, course)
    end
  end

  def behavior_append_completed(behavior, course)
    {
      **behavior.as_json,
      completed: behavior.completed?(@user),
      has_h2h: has_h2h?(behavior),
      has_behavior_maps: has_behavior_maps?(behavior),
      enrolled_in: @user.enrolled_in?(behavior),
      is_additional_behavior: behavior.is_additional_behavior(course)
    }
  end

  def has_behavior_maps?(behavior)
    behavior.behavior_maps.any?
  end

  # This method checks if a behavior has any associated HelpToHabit.
  def has_h2h?(behavior)
    behavior.help_to_habits.any?
  end
end
