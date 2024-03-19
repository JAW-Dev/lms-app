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

class SubscriptionOrder < Order
  attr_accessor :reminder
  before_update :cancel_subscription, if: :paused?
  before_update :process_resubscription, if: :resubscribed?
  after_update :set_reminder, if: :reminder

  def base_price
    Money.from_amount(200)
  end

  def order_behaviors
    courses.includes(:behaviors).flat_map(&:behaviors)
  end

  private

  def cancel_subscription
    unless status_was == 'paused'
      PaymentService.new(processor).cancel_subscription(self)
    end
  end

  def process_resubscription
    unless status_was == 'resubscribed'
      PaymentService.new(processor).process_resubscription(self)
    end
  end
  def set_reminder
    remind_months = reminder.to_i
    unless remind_months.zero?
      Messenger
        .renewal_reminder(self)
        .deliver_later(wait_until: remind_months.months.from_now)
    end
  end
end
