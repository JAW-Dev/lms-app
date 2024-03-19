# == Schema Information
#
# Table name: curriculum_course_behaviors
#
#  id          :bigint(8)        not null, primary key
#  position    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  behavior_id :bigint(8)        not null
#  course_id   :bigint(8)        not null
#

require 'rails_helper'

RSpec.describe Curriculum::CourseBehavior, type: :model do
  it 'has a valid factory' do
    expect(create(:curriculum_course_behavior)).to be_valid
  end
end
