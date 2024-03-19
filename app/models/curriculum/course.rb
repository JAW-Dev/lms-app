# == Schema Information
#
# Table name: curriculum_courses
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  enabled     :boolean          default(FALSE)
#  options     :jsonb
#  position    :integer
#  poster      :string
#  sku         :string
#  slug        :string
#  title       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Curriculum::Course < ApplicationRecord
  resourcify
  extend FriendlyId
  friendly_id :title, use: :history

  acts_as_list

  has_many :course_behaviors, -> { order(position: :asc) }, dependent: :destroy
  has_many :behaviors, through: :course_behaviors

  has_many :user_invite_courses
  has_many :user_invites, through: :user_invite_courses

  has_many :order_courses
  has_many :orders, through: :order_courses

  has_one :quiz, dependent: :destroy

  store :options, accessors: %i[display icon]

  scope :enabled, -> { where(enabled: true) }
  scope :modules, -> { where('sku like ?', 'MOD%') }
  scope :bundles, -> { where('sku like ?', 'BUN%') }

  validates_presence_of :title, :sku

  mount_uploader :poster, ImageUploader

  def should_generate_new_friendly_id?
    title_changed?
  end

  def self.intro
    enabled.order(position: :asc).first
  end

  def self.bonus
    enabled.where('title like ? or title like ?', '%Additional%', '%Bonus%')
      .first
  end

  def self.with_behaviors
    joins(:behaviors)
      .group('curriculum_courses.id')
      .having('count(course_id) > 0')
  end

  def self.display_types
    { default: 'Default', featured: 'Featured', expandable: 'Expandable' }
  end

  def self.icon_types
    { number: 'Number', star: 'Star', logo: 'ALD Logo', none: 'None' }
  end

  def intro?
    self.class.intro&.id == id
  end

  def bonus?
    self.class.bonus&.id == id
  end

  def completed?(user)
    behaviors.all? { |behavior| behavior.completed?(user) }
  end

  def display
    options[:display] || self.class.display_types.keys.first.to_s
  end

  def icon
    options[:icon] || self.class.icon_types.keys.first.to_s
  end

  # create dynamic methods like featured_display? and star_icon?
  %i[display icon].each do |accessor|
    Curriculum::Course
      .send("#{accessor}_types")
      .keys
      .each do |key|
        define_method "#{key}_#{accessor}?" do
          self.send(accessor) === key.to_s
        end
      end
  end
end
