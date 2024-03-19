# == Schema Information
#
# Table name: curriculum_webinars
#
#  id                :bigint(8)        not null, primary key
#  audio_uuid        :string
#  description       :text
#  player_uuid       :string
#  presented_at      :datetime
#  registration_link :string
#  slug              :string
#  subtitle          :string
#  title             :string
#  video_length      :float
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class Curriculum::Webinar < ApplicationRecord
  resourcify
  extend FriendlyId
  friendly_id :title, use: :history

  validates_presence_of :title, :presented_at

  before_save :update_video_length

  def has_audio?
    audio_uuid.present?
  end

  def should_generate_new_friendly_id?
    title_changed?
  end

  def update_video_length
    if player_uuid_changed?
      self.video_length = VidyardService.new(self).get_video_length
    end
  end

  def self.upcoming
    where('presented_at >= ?', DateTime.now).order(presented_at: :asc)
  end

  def self.past
    where
      .not(player_uuid: ['', nil])
      .where('presented_at < ?', DateTime.now)
      .order(presented_at: :desc)
  end
end
