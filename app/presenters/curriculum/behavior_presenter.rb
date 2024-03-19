class Curriculum::BehaviorPresenter < VideoPresenter
  def watch_text(user, course)
    if user
      if object.completed?(user)
        'Watch Again'
      elsif user.viewed_behaviors.pluck(:behavior_id).include?(object.id)
        'Continue'
      elsif user.enrolled_in?(course)
        'Start'
      else
        'Purchase'
      end
    else
      'Sign Up to Watch'
    end
  end

  def watch_link(user, course, bundle = nil)
    if user.present? && (user.enrolled_in?(course) || user.enrolled_in?(object))
      if bundle.present?
        curriculum_bundle_behavior_path(bundle, object)
      else
        curriculum_course_behavior_path(course, object)
      end
    elsif user.present? && user.up_for_renewal?
      subscription_details_path
    else
      new_curriculum_order_path
    end
  end

  def status(user)
    return 'locked unplayed' unless user

    enrolled =
      user.enrolled_in?(object) ||
        object.courses.any? { |course| user.enrolled_in?(course) }
    availability = enrolled ? 'unlocked' : 'locked'

    progress = 'unplayed'
    if object.completed?(user)
      progress = 'completed'
    elsif user.viewed_behaviors.pluck(:behavior_id).include?(object.id)
      progress = 'in-progress'
    end

    [availability, progress].join(' ')
  end

  def form_url(course = nil)
    if course.present?
      if object.new_record?
        admin_curriculum_course_behaviors_path(course: course)
      else
        admin_curriculum_course_behaviors_path(course: course)
      end
    else
      if object.new_record?
        admin_curriculum_behaviors_path
      else
        admin_curriculum_behavior_path(object)
      end
    end
  end

  def number(count, course)
    if count.zero?
      '<i class="fas fa-star"></i>'.html_safe
    elsif Rails.configuration.features.dig(:options)&.dig(:number_behaviors)
      count
    end
  end

  def thumbnail_url
    if !object.poster.file.nil?
      object.poster.large.url
    elsif object.player_uuid.present?
      "https://play.vidyard.com/#{object.player_uuid}.jpg"
    else
      asset_path('blank.png')
    end
  end

  def class_name(count, course)
    count.zero? ? 'behavior behavior--feature' : 'behavior'
  end

  def gift_order(user)
    object.orders.joins(:gift).where(gifts: { user: user }).last
  end
end
