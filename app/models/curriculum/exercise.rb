# == Schema Information
#
# Table name: curriculum_exercises
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  image       :string
#  position    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)
#

class Curriculum::Exercise < ApplicationRecord
  resourcify
  acts_as_list scope: :behavior

  belongs_to :behavior

  validates_presence_of :description

  mount_uploader :image, ImageUploader
end
