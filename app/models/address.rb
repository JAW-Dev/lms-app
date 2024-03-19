# == Schema Information
#
# Table name: addresses
#
#  id           :bigint(8)        not null, primary key
#  city         :string
#  company_name :string
#  full_name    :string
#  line1        :string
#  line2        :string
#  type         :string
#  zip          :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  country_id   :bigint(8)
#  order_id     :bigint(8)        not null
#  state_id     :bigint(8)
#

class Address < ApplicationRecord
  attr_accessor :state_abbr, :country_alpha2
  belongs_to :order
  belongs_to :state, optional: true
  belongs_to :country, optional: true

  validates_presence_of :full_name

  def full_name
    self[:full_name] || ProfilePresenter.new(order.user.profile).full_name
  end

  def state_abbr=(value)
    self.state = State.find_by_abbr(value)
  end

  def country_alpha2=(value)
    self.country = Country.find_by_alpha2(value)
  end
end
