# == Schema Information
#
# Table name: curriculum_questions
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  position    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)
#

class Curriculum::Question < ApplicationRecord
  resourcify
  acts_as_list scope: :behavior

  belongs_to :behavior

  validates_presence_of :description
end
