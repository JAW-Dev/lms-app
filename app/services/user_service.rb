module UserService
  def export(status: :all)
    file_path = "#{Rails.root}/tmp/users_#{status}.csv"
    records = []

    unless status == :pending
      User
        .send(status)
        .find_each
        .each do |user|
          profile = ProfilePresenter.new(user.profile)
          invite = user.user_invite
          invited_on =
            if invite.present? && invite.invited_at.present?
              invite.invited_at.strftime('%m/%d/%y')
            else
              'N/A'
            end
          expires_on =
            if invite.present? && invite.expires_at.present?
              invite.expires_at.strftime('%m/%d/%y')
            else
              'N/A'
            end
          access_type = invite.present? ? invite.access_type : 'N/A'
          registered_on = user.created_at.strftime('%m/%d/%y')
          records << {
            email: user.email,
            name: profile.full_name,
            status: user.confirmed? ? 'active' : 'inactive',
            confirmed: user.confirmed? ? 'Y' : 'N',
            has_invite: invite.present? ? 'Y' : 'N',
            access_type: access_type,
            invited_on: invited_on,
            expires_on: expires_on,
            registered_on: registered_on,
            sort_date: user.created_at
          }
        end
    end

    if status == :all || status == :pending
      UserInvite.pending.find_each.each do |user|
        expires_on =
          if user.expires_at.present?
            user.expires_at.strftime('%m/%d/%y')
          else
            'N/A'
          end
        records << {
          email: user.email,
          name: user.name || 'N/A',
          status: 'pending',
          confirmed: 'N',
          has_invite: 'Y',
          access_type: user.access_type,
          invited_on: user.invited_at.strftime('%m/%d/%y'),
          expires_on: expires_on,
          registered_on: 'N/A',
          sort_date: user.invited_at
        }
      end
    end

    CSV.open(file_path, 'w') do |csv|
      csv << [
        'email',
        'name',
        'status',
        'confirmed',
        'has invite',
        'invite type',
        'invited on',
        'expires on',
        'registered on'
      ]
      records
        .sort_by { |record| -record[:sort_date].to_i }
        .each do |record|
          record.delete(:sort_date)
          csv << record.values
        end
    end

    file_path
  end

  extend self
end
