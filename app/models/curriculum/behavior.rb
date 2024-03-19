# == Schema Information
#
# Table name: curriculum_behaviors
#
#  id             :bigint(8)        not null, primary key
#  audio_uuid     :string
#  description    :text
#  enabled        :boolean          default(FALSE)
#  example_image  :string
#  exercise_image :string
#  player_uuid    :string
#  poster         :string
#  price_cents    :integer          default(0), not null
#  price_currency :string           default("USD"), not null
#  sku            :string
#  slug           :string
#  subtitle       :string
#  title          :string
#  video_length   :float            default(0.0)
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class Curriculum::Behavior < ApplicationRecord
  resourcify
  extend FriendlyId
  friendly_id :title, use: :history

  monetize :price_cents

  enum h2h_status: { active: 0, inactive: 1 }

  has_many :course_behaviors, dependent: :destroy
  has_many :courses, through: :course_behaviors

  has_many :examples, -> { order(position: :asc) }, dependent: :destroy
  has_many :questions, -> { order(position: :asc) }, dependent: :destroy
  has_many :exercises, -> { order(position: :asc) }, dependent: :destroy
  has_many :behavior_maps, -> { order(position: :asc) }, dependent: :destroy

  has_many :notes, as: :notable, dependent: :destroy

  has_many :user_behaviors, dependent: :destroy
  has_many :users, through: :user_behaviors

  has_many :order_behaviors, dependent: :destroy
  has_many :orders, through: :order_behaviors

  has_many :help_to_habits, class_name: 'HelpToHabit', foreign_key: 'curriculum_behavior_id'
  has_many :help_to_habit_progresses, class_name: 'HelpToHabitProgress', foreign_key: 'curriculum_behavior_id',
                                      dependent: :destroy

  has_one  :h2h_intro, lambda {
                         where(placement: :intro)
                       }, class_name: 'HelpToHabitExtra', foreign_key: 'curriculum_behavior_id'
  has_one :h2h_outro, lambda {
                        where(placement: :outro)
                      }, class_name: 'HelpToHabitExtra', foreign_key: 'curriculum_behavior_id'

  scope :enabled, -> { where(enabled: true) }

  validates_presence_of :title, :player_uuid
  validates :sku, presence: true, uniqueness: true

  before_save :update_video_length

  mount_uploader :exercise_image, ImageUploader
  mount_uploader :example_image, ImageUploader
  mount_uploader :poster, ImageUploader

  def is_intro?(course)
    course.course_behaviors.find_by(behavior: self).first?
  end

  def is_last?(course)
    course.course_behaviors.find_by(behavior: self).last?
  end

  def is_additional_behavior(course)
    course.course_behaviors.find_by(behavior: self).is_additional_behavior
  end

  def should_generate_new_friendly_id?
    title_changed?
  end

  def completed?(user)
    user && user.viewed_behaviors.completed.pluck(:behavior_id).include?(id)
  end

  def update_video_length
    self.video_length = VidyardService.new(self).get_video_length if player_uuid_changed?
  end

  def self.with_notes(user)
    joins(notes: [:action_text_rich_text])
      .where('curriculum_notes.user_id = ?', user)
      .where('action_text_rich_texts.body IS NOT NULL')
  end

  def has_audio?
    audio_uuid.present?
  end
end
