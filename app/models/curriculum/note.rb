# == Schema Information
#
# Table name: curriculum_notes
#
#  id           :bigint(8)        not null, primary key
#  notable_type :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  notable_id   :bigint(8)
#  user_id      :bigint(8)
#

class Curriculum::Note < ApplicationRecord
  resourcify
  belongs_to :notable, polymorphic: true
  belongs_to :user

  has_rich_text :content
  has_one :action_text_rich_text,
          class_name: 'ActionText::RichText',
          as: :record
end
