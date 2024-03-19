# == Schema Information
#
# Table name: curriculum_quizzes
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  course_id   :bigint(8)        not null
#

require 'rails_helper'

RSpec.describe Curriculum::Quiz, type: :model do
  it 'has a valid factory' do
    expect(create(:curriculum_quiz)).to be_valid
  end
end
