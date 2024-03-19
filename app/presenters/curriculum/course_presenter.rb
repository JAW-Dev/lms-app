include ActionView::Helpers::TextHelper
include ActionView::Helpers::NumberHelper

class Curriculum::CoursePresenter < BasePresenter
  def video_count
    if object.behaviors.enabled.any?
      pluralize(object.behaviors.enabled.count, 'video')
    end
  end

  def total_time
    total = object.behaviors.enabled.pluck(:video_length).sum
    hours, minutes = find_time(total)

    time = []
    time << pluralize(hours, 'hour') if hours > 0
    time << pluralize(minutes, 'minute') if minutes > 0
    time.join(' ')
  end

  def status(user)
    return 'locked' unless user
    case
    when user.enrolled_in?(object)
      'unlocked'
    when object.behaviors.any? { |behavior| user.enrolled_in?(behavior) }
      'unlocked'
    else
      'locked'
    end
  end

  def watch_text(user)
    if user
      if object.completed?(user)
        'Review'
      elsif (
            user.enrolled_in?(object) ||
              object.behaviors.any? { |behavior| user.enrolled_in?(behavior) }
          ) &&
            (
              object.behaviors &
                user.viewed_behaviors.includes(:behavior).map(&:behavior)
            ).size > 0
        'Continue'
      elsif user.enrolled_in?(object) ||
            object.behaviors.any? { |behavior| user.enrolled_in?(behavior) }
        'Start'
      else
        'Learn More'
      end
    else
      'Sign Up to Get Access'
    end
  end

  def purchase_date(user)
    l(
      user.roles.find_by(name: :participant, resource: object).created_at,
      format: :short_with_year
    )
  end

  def progress_percent(user)
    completed_behaviors =
      object.behaviors.enabled.select { |behavior| behavior.completed?(user) }
    completed = [0, completed_behaviors.count].max
    total = [1, object.behaviors.enabled.count].max.to_f
    number_to_percentage((completed / total) * 100, precision: 0)
  end

  def progress_text(user)
    progress_percent(user) == '100%' ? 'Complete' : 'In progress'
  end

  def progress_icon(user)
    if progress_percent(user) == '100%'
      'fas fa-check fa-xs'
    else
      'fas fa-sync-alt fa-xs'
    end
  end

  def number(count)
    if object.star_icon?
      '<i class="fas fa-star"></i>'.html_safe
    elsif object.logo_icon?
      inline_svg('icon-ald-circle.svg')
    elsif Rails.configuration.features.dig(:options)&.dig(:number_behaviors)
      count
    end
  end

  def thumbnail_url
    if !object.poster.file.nil?
      object.poster.large.url
    elsif object.behaviors.first&.player_uuid.present?
      "https://play.vidyard.com/#{object.behaviors.first.player_uuid}.jpg"
    else
      asset_path('blank.png')
    end
  end
end
