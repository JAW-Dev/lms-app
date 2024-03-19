# == Schema Information
#
# Table name: companies
#
#  id         :bigint(8)        not null, primary key
#  city       :string
#  line_one   :string
#  line_two   :string
#  name       :string
#  phone      :string
#  slug       :string
#  zip        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  country_id :bigint(8)
#  state_id   :bigint(8)
#

class Company < ApplicationRecord
  resourcify
  extend FriendlyId
  friendly_id :name, use: :history

  include PgSearch::Model
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    city: 'B',
                    line_one: 'C',
                    line_two: 'C'
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }

  belongs_to :country
  belongs_to :state, optional: true
  has_many :users

  validates_presence_of :name, :line_one, :city

  def should_generate_new_friendly_id?
    name_changed?
  end
end
