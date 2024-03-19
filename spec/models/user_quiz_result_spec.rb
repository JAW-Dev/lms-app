# == Schema Information
#
# Table name: user_quiz_results
#
#  id         :bigint(8)        not null, primary key
#  score      :float
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  quiz_id    :bigint(8)        not null
#  user_id    :bigint(8)        not null
#

require 'rails_helper'

RSpec.describe UserQuizResult, type: :model do
  it 'has a valid factory' do
    expect(create(:user_quiz_result)).to be_valid
  end
end
