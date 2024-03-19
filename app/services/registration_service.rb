class RegistrationService
  def initialize(user)
    @user = user
  end

  def activate_seat(seat)
    return if seat.blank?

    seat.update(user: @user, status: :active)
    @user.update(company: seat.order.user.company)
    seat.order.courses.each { |course| @user.add_role(:participant, course) }
  end

  def deactivate_seat(seat)
    return if seat.blank?

    seat.update(user: nil, status: :pending)
    if @user.present?
      @user.update(company: nil)
      seat.order.courses.each do |course|
        @user.remove_role(:participant, course)
      end
    end
  end

  def process_invitation(invitation)
    return if invitation.blank?

    add_unlimited_gift_permission(invitation)

    # remove previously enrolled courses if not in invitation
    @user
      .enrolled_courses
      .where.not(id: invitation.courses)
      .each do |course|
        @user.remove_role(:participant, course) unless course.first?
      end

    # enroll in courses
    invitation.courses.each { |course| @user.add_role(:participant, course) }

    # update expires_at
    expires_at = invitation.expires_at
    if !expires_at && invitation.valid_for_days.present?
      expires_at = DateTime.now + invitation.valid_for_days.days
    end

    @user.profile.access_type = invitation.user_access_type
    @user.save

    AccessExpirationJob.set(wait_until: expires_at).perform_later(@user.id)

    invitation.update(
      user: @user,
      status: :active,
      expires_at: expires_at,
      valid_for_days: nil
    )
  end

  def revoke_invitation(invitation)
    return if invitation.blank?

    if invitation.expired?
      invitation.courses.each do |course|
        @user.remove_role(:participant, course) unless course.first?
      end
      invitation.destroy
    end
  end

  def open_gift(gift)
    return if gift.blank?

    if gift.expires_at.nil?
      gift.update(user: @user, status: :redeemed, expires_at: DateTime.now + 1.year)
    else
      gift.update(user: @user, status: :redeemed)
    end
    
    gift.order.behaviors.each do |behavior|
      @user.add_role(:participant, behavior)
    end
    gift.order.courses.each do |course|
      @user.add_role(:participant, course.behaviors.first)
    end
  end

  def return_gift(gift)
    return if gift.blank?

    gift.update(user: nil, recipient_email: nil, status: :pending)
    gift.order.behaviors.each do |behavior|
      @user.remove_role(:participant, behavior)
    end
    gift.order.courses.each do |course|
      @user.remove_role(:participant, course.behaviors.first)
    end
  end

  def add_unlimited_gift_permission(invitation)
    @user.add_role(:unlimited_gifts) if invitation.unlimited_gifts
  end
end
