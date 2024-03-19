class HelpToHabitExtra < ApplicationRecord
    #                     :id => :integer,
    #                :content => :text,
    #              :placement => :integer,
    # :curriculum_behavior_id => :integer,
    #             :created_at => :datetime,
    #             :updated_at => :datetime

  enum placement: { intro: 0, outro: 1 }

  belongs_to :behavior, class_name: "Curriculum::Behavior", foreign_key: "curriculum_behavior_id"
end
