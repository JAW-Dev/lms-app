include ActionView::Helpers::TextHelper

class VideoPresenter < BasePresenter
  def video_time
    hours, minutes = find_time(object.video_length)
    pluralize(minutes, 'minute')
  end

  def total_time
    hours, minutes = find_time(object.video_length)

    time = []
    time << pluralize(hours, 'hour') if hours > 0
    time << pluralize(minutes, 'minute') if minutes > 0
    time.join(' ')
  end

  def thumbnail_url
    if object.player_uuid.present?
      "https://play.vidyard.com/#{object.player_uuid}.jpg"
    else
      asset_path('blank.png')
    end
  end

  def page_title(media_type = nil)
    if media_type == 'audio' && object.has_audio?
      "#{object.title} (Audio Only)"
    else
      object.title
    end
  end

  def media_uuid(media_type = nil)
    if media_type == 'audio' && object.has_audio?
      object.audio_uuid
    else
      object.player_uuid
    end
  end
end
