# == Schema Information
#
# Table name: curriculum_courses
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  enabled     :boolean          default(FALSE)
#  options     :jsonb
#  position    :integer
#  poster      :string
#  sku         :string
#  slug        :string
#  title       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

require 'rails_helper'

RSpec.describe Curriculum::Course, type: :model do
  it 'has a valid factory' do
    expect(create(:curriculum_course)).to be_valid
  end

  it 'is invalid without a title' do
    expect(build(:curriculum_course, title: nil)).to be_invalid
  end

  it 'is invalid without a sku' do
    expect(build(:curriculum_course, sku: nil)).to be_invalid
  end
end
