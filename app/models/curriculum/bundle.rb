# == Schema Information
#
# Table name: curriculum_bundles
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  enabled     :boolean          default(TRUE)
#  image       :string
#  name        :string
#  sku         :string
#  slug        :string
#  subheading  :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  company_id  :bigint(8)
#

class Curriculum::Bundle < ApplicationRecord
  resourcify
  extend FriendlyId
  friendly_id :name, use: :history

  belongs_to :company, optional: true

  has_many :bundle_courses, -> { order(position: :asc) }, dependent: :destroy
  has_many :courses, through: :bundle_courses

  validates_presence_of :name

  mount_uploader :image, ImageUploader

  def should_generate_new_friendly_id?
    name_changed?
  end
end
