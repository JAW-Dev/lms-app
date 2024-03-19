# == Schema Information
#
# Table name: countries
#
#  id         :bigint(8)        not null, primary key
#  alpha2     :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Country < ApplicationRecord
  has_many :states

  validates :name, presence: true
  validates :alpha2, length: { is: 2 }
end
