# == Schema Information
#
# Table name: curriculum_bundles
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  enabled     :boolean          default(TRUE)
#  image       :string
#  name        :string
#  sku         :string
#  slug        :string
#  subheading  :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  company_id  :bigint(8)
#

require 'rails_helper'

RSpec.describe Curriculum::Bundle, type: :model do
  it 'has a valid factory' do
    expect(create(:curriculum_bundle)).to be_valid
  end

  it 'is invalid without a name' do
    expect(build(:curriculum_bundle, name: nil)).to be_invalid
  end
end
