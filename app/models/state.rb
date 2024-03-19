# == Schema Information
#
# Table name: states
#
#  id         :bigint(8)        not null, primary key
#  abbr       :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  country_id :bigint(8)
#

class State < ApplicationRecord
  belongs_to :country

  validates :name, presence: true
  validates :abbr, length: { is: 2 }
end
