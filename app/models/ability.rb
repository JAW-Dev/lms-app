# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(current_user)
    can :index, Curriculum::Course
    return unless current_user
    can :read, Curriculum::Course
    if current_user.has_full_access? || current_user.has_role?(:admin)
      can :read, Curriculum::Event
    end
    if current_user.has_full_access? || current_user.has_role?(:admin)
      can :read, Curriculum::Webinar
    end
    if current_user.has_full_access? || current_user.has_role?(:admin)
      can :read, Curriculum::BookSummary
    end
    can :read, Curriculum::Bundle
    if current_user.has_full_access? || current_user.has_role?(:admin)
      can :view_conference, :subscriber_content
    end
    if Rails.configuration.features.dig(:notes)
      can %i[read create update], Curriculum::Note
    end
    can :create, Order if Rails.configuration.features.dig(:ecomm)
    can %i[read update], Order do |order|
      Rails.configuration.features.dig(:ecomm) &&
        (order.user == current_user || current_user.has_role?(:admin))
    end
    can %i[read audio], Curriculum::Behavior do |behavior|
      current_user.has_role?(:participant, behavior) ||
        behavior.courses.any? do |course|
          current_user.has_role?(:participant, course)
        end || current_user.has_role?(:admin)
    end
    can %i[edit update], Gift do |gift|
      Rails.configuration.features.dig(:ecomm) &&
        (gift.order.user == current_user || current_user.has_role?(:admin))
    end
    can :read, Curriculum::Quiz do |quiz|
      current_user.has_role?(:participant, quiz.course) ||
        current_user.has_role?(:admin)
    end
    unless (
             current_user&.company &&
               current_user.has_role?(:company_rep, current_user.company)
           ) || current_user.has_role?(:admin)
      return
    end
    can :create, UserSeat if Rails.configuration.features.dig(:ecomm)
    can %i[read update destroy], UserSeat do |user_seat|
      Rails.configuration.features.dig(:ecomm) &&
        (user_seat.order.user == current_user || current_user.has_role?(:admin))
    end
  end
end
