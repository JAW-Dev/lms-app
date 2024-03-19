class UserInvitePresenter < Pres::Presenter
  def domain
    object.email.split('@').last
  end

  def invite_type
    if (Curriculum::Course.enabled.modules - object.courses).empty?
      invite_type = object.limited? ? 'Full access - week' : 'Full access'
    else
      invite_type = 'Partial access'
    end
  end

  def resend_params
    {
      user_invite: {
        invited_at: DateTime.now,
        expires_at: object.unlimited? ? 1.year.from_now : 1.week.from_now
      }
    }.to_query
  end
end
