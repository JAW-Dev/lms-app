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

class BillingAddress < Address
end
