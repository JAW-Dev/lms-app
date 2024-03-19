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

class UserQuizResult < ApplicationRecord
  belongs_to :user
  belongs_to :quiz, class_name: 'Curriculum::Quiz'
end
