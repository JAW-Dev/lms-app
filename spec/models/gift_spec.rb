# == Schema Information
#
# Table name: gifts
#
#  id              :bigint(8)        not null, primary key
#  anonymous       :boolean          default(FALSE)
#  message         :text
#  recipient_email :string
#  recipient_name  :string
#  slug            :string
#  status          :integer          default("pending")
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  order_id        :bigint(8)        not null
#  user_id         :bigint(8)
#

require 'rails_helper'

RSpec.describe Gift, type: :model do
  it 'has a valid factory' do
    expect(create(:gift)).to be_valid
  end
end
