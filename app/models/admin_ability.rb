# frozen_string_literal: true

class AdminAbility
  include CanCan::Ability

  def initialize(current_user)
    return unless current_user
    can %i[show update users], Company do |company|
      current_user.has_role?(:manager) ||
        current_user.has_role?(:company_rep, company)
    end
    can :show, User do |user|
      current_user.has_role?(:manager) ||
        current_user.has_role?(:company_rep, user.company)
    end
    return unless current_user.has_role?(:manager) || current_user.cra_employee?
    can :manage, UserInvite, invited_by: current_user
    return unless current_user.has_role?(:manager)
    can :manage, UserInvite
    can :manage, Company
    can :read, User
    can :manage, User do |user|
      (!user.has_role?(:manager) && !user.has_role?(:admin)) ||
        user == current_user
    end
    can :read, :page #dashboard
    can :manage, Order if Rails.configuration.features.dig(:ecomm)
    return unless current_user.has_role?(:admin)
    can :manage, Curriculum::Course
    can :manage, Curriculum::Behavior
    can :manage, Curriculum::BehaviorMap
    can :manage, Curriculum::Exercise
    can :manage, Curriculum::Example
    can :manage, Curriculum::Event
    can :manage, Curriculum::Question
    can :manage, Curriculum::Quiz
    can :manage, Curriculum::QuizQuestion
    can :manage, Curriculum::QuizQuestionAnswer
    can :manage, Curriculum::Webinar
    can :manage, Curriculum::BookSummary
    can :manage, Curriculum::Bundle
  end
end
