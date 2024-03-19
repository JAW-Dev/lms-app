class HelpToHabit < ApplicationRecord
    #                     :id => :integer,
    #                :content => :text,
    #                  :order => :integer,
    # :curriculum_behavior_id => :integer,
    #             :created_at => :datetime,
    #             :updated_at => :datetime

    
  belongs_to :behavior, class_name: "Curriculum::Behavior", foreign_key: "curriculum_behavior_id"

  def next
    self.class.where("curriculum_behavior_id = ? AND \"order\" > ?", curriculum_behavior_id, order).order("\"order\" ASC").first
  end

  def self.logger
    H2HLogger.new
  end
end
