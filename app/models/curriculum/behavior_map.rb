# == Schema Information
#
# Table name: curriculum_behavior_maps
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  image       :string
#  position    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)
#

class Curriculum::BehaviorMap < ApplicationRecord
  resourcify
  acts_as_list scope: :behavior

  belongs_to :behavior

  has_many :user_habits
  has_many :users, through: :user_habits

  validates_presence_of :description

  mount_uploader :image, ImageUploader
end
