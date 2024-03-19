# == Schema Information
#
# Table name: curriculum_quiz_questions
#
#  id         :bigint(8)        not null, primary key
#  content    :text
#  position   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  quiz_id    :bigint(8)        not null
#

require 'rails_helper'

RSpec.describe Curriculum::QuizQuestion, type: :model do
  it 'has a valid factory' do
    expect(create(:curriculum_quiz_question)).to be_valid
  end

  it 'is invalid without content' do
    expect(build(:curriculum_quiz_question, content: nil)).to be_invalid
  end
end
