# == Schema Information
#
# Table name: user_behaviors
#
#  id          :bigint(8)        not null, primary key
#  status      :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)
#  user_id     :bigint(8)
#

class UserBehavior < ApplicationRecord
  enum status: { watched: 0, completed: 1 }

  belongs_to :user
  belongs_to :behavior, class_name: 'Curriculum::Behavior'
end
