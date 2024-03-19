class UserPresenter < Pres::Presenter
  def video_status(behavior)
    begin
      object.viewed_behaviors.find_by_behavior_id(behavior).status
    rescue StandardError
      'unwatched'
    end
  end

  def next_behavior(course)
    last_watched =
      object.present? &&
        object
          .viewed_behaviors
          .includes(:behavior)
          .watched
          .order(updated_at: :desc)
          .first
          &.behavior
    next_unwatched =
      course
        .course_behaviors
        .includes(:behavior)
        .find do |course_behavior|
          course_behavior.behavior.enabled? &&
            !course_behavior.behavior.completed?(object)
        end

    if last_watched.present? && course.behaviors.include?(last_watched)
      last_watched
    else
      next_unwatched.present? ? next_unwatched.behavior : course.behaviors.first
    end
  end

  def next_bundle_behavior(bundle)
    last_watched =
      object.present? &&
        object
          .viewed_behaviors
          .includes(:behavior)
          .watched
          .order(updated_at: :desc)
          .first
          &.behavior
    bundle_behaviors =
      bundle
        .bundle_courses
        .includes([bundle_course_behaviors: :behavior], :course)
        .flat_map(&:bundle_course_behaviors)
    next_unwatched =
      bundle_behaviors.find do |bundle_behavior|
        bundle_behavior.behavior.enabled? &&
          !bundle_behavior.behavior.completed?(object)
      end

    if last_watched.present? &&
         bundle_behaviors.map(&:behavior).include?(last_watched)
      bundle_behaviors.find do |bundle_behavior|
        bundle_behavior.behavior == last_watched
      end
    else
      next_unwatched.present? ? next_unwatched : bundle_behaviors.first
    end
  end

  def payment_methods
    PaymentService.new.list_payment_methods(object)
  end

  def payment_method_expired?(month, year)
    DateTime.now > DateTime.new(year, month).end_of_month
  end
end
