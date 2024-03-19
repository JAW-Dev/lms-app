# == Schema Information
#
# Table name: order_behaviors
#
#  id          :bigint(8)        not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)        not null
#  order_id    :bigint(8)        not null
#

class OrderBehavior < ApplicationRecord
  belongs_to :order
  belongs_to :behavior, class_name: 'Curriculum::Behavior'
end
