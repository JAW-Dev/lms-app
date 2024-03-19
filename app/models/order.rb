# == Schema Information
#
# Table name: orders
#
#  id                 :bigint(8)        not null, primary key
#  discount_cents     :integer          default(0), not null
#  notes              :text
#  processor          :string
#  qty                :integer          default(1)
#  sales_tax_cents    :integer          default(0), not null
#  sales_tax_currency :string           default("USD"), not null
#  slug               :string
#  sold_at            :datetime
#  status             :integer          default("pending")
#  subtotal_cents     :integer          default(0), not null
#  subtotal_currency  :string           default("USD"), not null
#  type               :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  transaction_id     :string
#  user_id            :bigint(8)
#

class Order < ApplicationRecord
  extend FriendlyId
  friendly_id :uuid, use: :slugged

  attr_accessor :nonce, :billing, :payment_method_id
  enum status: {
         cancelled: -1,
         pending: 0,
         complete: 1,
         paused: 2,
         resubscribed: 3
       }

  include PgSearch::Model
  pg_search_scope :search_for,
                  associated_against: {
                    user: [:email],
                    gift: %i[recipient_email recipient_name]
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }

  monetize :subtotal_cents
  monetize :sales_tax_cents
  monetize :total_cents
  monetize :discount_cents

  belongs_to :user
  has_many :order_courses, dependent: :destroy
  has_many :courses, through: :order_courses

  has_many :order_behaviors, dependent: :destroy
  has_many :behaviors, through: :order_behaviors

  has_many :user_seats, dependent: :destroy

  has_one :gift, dependent: :destroy
  accepts_nested_attributes_for :gift
  has_one :billing_address, dependent: :destroy
  accepts_nested_attributes_for :billing_address

  validates :qty, numericality: { greater_than: 0 }

  before_save :update_discount, :update_subtotal

  def total_cents
    return subtotal_cents + sales_tax_cents
  end

  def uuid
    SecureRandom.uuid
  end

  def base_price
    order_behaviors.map(&:price).reduce(0, :+)
  end

  def cost_with_discount
    base_price - (base_price * discount_amount) - discount
  end

  def discount_amount
    0
  end

  def order_behaviors
    courses.includes(:behaviors).flat_map(&:behaviors)
  end

  def gift?
    gift.present?
  end

  private

  def update_discount
    self.discount_cents = 0
  end

  def update_subtotal
    self.subtotal = cost_with_discount * qty
  end
end
