# == Schema Information
#
# Table name: user_invite_courses
#
#  id             :bigint(8)        not null, primary key
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  course_id      :bigint(8)        not null
#  user_invite_id :bigint(8)        not null
#

require 'rails_helper'

RSpec.describe UserInviteCourse, type: :model do
  it 'has a valid factory' do
    expect(create(:user_invite_course)).to be_valid
  end
end
