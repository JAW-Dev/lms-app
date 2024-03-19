class Api::V2::Admin::UsersController < Api::V2::Admin::AdminController
    include Pagy::Backend
    before_action :set_query_param

    def index
        render json: { user: current_user.as_json(include: :profile)}, status: :ok
    end

    def users
        users = params[:confirmed] === true ?  User.confirmed.joins(:profile).order(created_at: :desc) : User.unconfirmed.joins(:profile).order(created_at: :desc)
        if @search_query.present?
            users = users.where("email ILIKE :search OR (profiles.first_name || ' ' || profiles.last_name) ILIKE :search", search: "%#{@search_query}%")
        end
        count = @count.present? ? @count.to_i : 20
        page = @page.present? ? @page.to_i : 1
        @pagy, @users = pagy(users, items: count, page: page)
        user_json = @users.map do |user|
            user.as_json(include: :profile).merge(discounted_cents: user.user_invite&.discount_cents)
        end
        render json: { users: user_json, pagination: { current_page: @pagy.page, total_pages: @pagy.pages, total_count: @pagy.count} }, status: :ok
    end

    def user_invites
        user_invites = UserInvite.all.order(invited_at: :desc)
        if @search_query.present?
            user_invites = user_invites.where('email LIKE ?', "%#{@search_query}%")
        end
        page = @page.present? ? @page.to_i : 1
        @pagy, @user_invites = pagy(user_invites, items: 20, page: page)
        user_invites_json = @user_invites.map do |user_invite|
            user_invite.as_json.merge(domain: user_invite.email.split('@').last)
        end
        render json: { user_invites: user_invites_json , pagination: { current_page: @pagy.page, total_pages: @pagy.pages, total_count: @pagy.count} }, status: :ok
    end

    def user_details
        user = User.find(@user_id)
        user_hash = user.attributes
        user_hash["user_invite"] = user.user_invite
        user_hash["profile"] =  user.profile
        user_hash["hubspot_properties"] = user.profile.hubspot_properties
        user_hash["hubspot_access_types"] = []
        hubspot = HubspotService.new(user)
        user_hash["hubspot_access_types"] = hubspot.get_options('access_type').sort_by { |option| option['label'] }

        user_hash["roles"] = user.roles.map(&:name)

        enabled_courses = Curriculum::Course.enabled

        courses = enabled_courses.map do |course|
            {
            id: course.id,
            enrolled_in: user.enrolled_in?(course),
            title: course.title,
            behaviors: course.behaviors.map do |behavior|
                {
                id: behavior.id,
                title: behavior.title,
                completed: behavior.completed?(user)
                }
            end
            }
        end
        user_hash["courses"] = courses
        render json: { user: user_hash }, status: :ok
    end

    def users_details
        users = User.where(id: @user_ids)

        user_details_array = []
      
        users.each do |user|
          user_hash = user.attributes
          user_hash["user_invite"] = user.user_invite
          user_hash["profile"] = user.profile
          user_hash["hubspot_properties"] = user.profile.hubspot_properties
          user_hash["hubspot_access_types"] = []
          hubspot = HubspotService.new(user)
          user_hash["roles"] = user.roles.map(&:name)
      
          enabled_courses = Curriculum::Course.enabled.order(position: :asc)
      
          courses = enabled_courses.map do |course|
            {
              id: course.id,
              enrolled_in: user.enrolled_in?(course),
              title: course.title,
              behaviors: course.behaviors.map do |behavior|
                {
                  id: behavior.id,
                  title: behavior.title,
                  completed: behavior.completed?(user)
                }
              end
            }
          end
          user_hash["courses"] = courses
      
          user_details_array << { user: user_hash }
        end
      
        render json: { users: user_details_array }, status: :ok
    end

    def update_user
        data = JSON.parse(request.body.read)
        invite_data = data['user_invite']

        user = User.find(data['id'])
        email = data["email"]&.strip
        email.downcase!

        if User.exists?(email: email) && user.email != email
            render json: { message: "Email already exists" }, status: :bad_request
            return
        end

        user.email = email
        user.profile.first_name = data["first_name"]
        user.profile.last_name = data["last_name"]
        user.profile.company_name = data["company_name"]
        user.profile.access_type = invite_data && invite_data["access_type"]
        user.profile.opt_out_eop = invite_data && invite_data["opt_out_eop"]

        update_invitation(invite_data, user) if invite_data

        user.skip_reconfirmation!
        user.save

        render json: { message: "Updated User" }, status: :ok
    end


    def update_invitation(invite_data, user)
        invite = invite_data['id'] ? UserInvite.find(invite_data['id']) : UserInvite.new
        invite.user_id = user&.id ? user.id : nil
        invite.email = user&.email if user&.email.present?
        invite.invited_at = DateTime.now()
        invite.expires_at = invite_data['expires_at'] if invite_data.key?('expires_at')
        invite.valid_for_days = invite_data['valid_for_days'] if invite_data.key?('valid_for_days')
        invite.access_type = invite_data['invitation_access'] if invite_data.key?('invitation_access')
        invite.user_access_type = invite_data["access_type"] if invite_data.key?('access_type')
        invite.unlimited_gifts = invite_data['unlimited_gifting'] if invite_data.key?('unlimited_gifting')
        if invite_data.key?('discount_cents') && !invite_data['discount_cents'].to_s.empty?
            invite.discount_cents =  (1000 - invite_data['discount_cents'].to_i) * 100
        else
            invite.discount_cents = 0
        end
        invite.invited_by = current_user
        invite.course_ids = invite_data['course_ids'] if invite_data.key?('course_ids')
        invite.opt_out_eop= params[:opt_out_eop]
        invite.skip_email = invite_data['skip_email'] if invite_data.key?('skip_email')
        invite.length_type = invite_data['length_type'] if invite_data.key?('length_type')
        invite.expiration_type = invite_data['expiration_type'] if invite_data.key?('expiration_type')

        if invite_data['length_type'] == 'years' && invite_data['expiration_type'] == 'length'
            invite.valid_for_days = invite.valid_for_days * 365
            invite.expires_at = Time.now + invite.valid_for_days * 24 * 60 * 60
        elsif invite_data['expiration_type'] == 'date'
            days_difference = (invite.expires_at.to_date - Date.today).to_i
            invite.valid_for_days = days_difference
            invite.length_type = nil
        end

        if invite.expires_at.nil?
            invite.expires_at = Time.now + invite.valid_for_days * 24 * 60 * 60
        end

        if user.id.present?
            if invite.unlimited_gifts
                user.add_role(:unlimited_gifts)
            else
                user.remove_role(:unlimited_gifts)
            end
        end

        if invite.save
            RegistrationService.new(user).process_invitation(invite) if user.id.present?
            unless invite.skip_email
                if invite.unlimited? || invite.expires_at.blank?
                    Messenger.welcome(invite.email, invite.name, true, invite.message)
                    .deliver_now
                end
                if invite.limited? && invite.expires_at.present?
                    Messenger.admin_invitation(invite.email, invite).deliver_now
                end
            end
        end
    end

    def invite_users
        data = JSON.parse(request.body.read)
        emails = data['emails']

        render json: {message: "No emails provided"}, status: :bad_request if emails.blank?

        emails.each do |email|
            user = User.find_by(email: email)
            invite = UserInvite.find_by(email: email)
            data['id'] = invite&.id
            update_invitation(data, user.present? ? user: OpenStruct.new(email: email))
        end

        render json: { message: "Invited #{emails.count} User#{emails.count === 1 ? "" : "s"}" }, status: :ok
    end

    def invitation_data
        hubspot_options = HubspotService.new(current_user).get_options('access_type').sort_by { |option| option['label'] }
        enabled_courses = Curriculum::Course.enabled
        render json: { hubspot_options: hubspot_options, enabled_courses: enabled_courses }, status: :ok
    end

    def resend_invites
        data = JSON.parse(request.body.read)

        data.each do |inviteData|
            invite = UserInvite.find(inviteData['id'])
            if invite.unlimited? || invite.expires_at.blank?
                    Messenger.welcome(invite.email, invite.name, true, invite.message)
                    .deliver_now
            end
            if invite.limited? && invite.expires_at.present?
                Messenger.admin_invitation(invite.email, invite).deliver_now
            end
        end
        render json: { message: "Resent #{data.count} Invite#{data.count === 1 ? "" : "s"}" }, status: :ok
    end

    def destroy_invites
        data = JSON.parse(request.body.read)
        data.each do |invite|
            UserInvite.find(invite['id']).destroy
        end
        render json: { message: "Deleted #{data.count} Invite#{data.count === 1 ? "" : "s"}" }, status: :ok
    end

    def destroy_users
        data = JSON.parse(request.body.read)
        data.each do |invite|
            User.find(invite['id']).destroy
        end
        render json: { message: "Deleted #{data.count} User#{data.count === 1 ? "" : "s"}" }, status: :ok
    end

    private
    def set_query_param
        @query = params[:query]
        @page = params[:page]
        @search_query = params[:search]&.strip
        @user_id = params[:user_id]
        @user_ids = params[:user_ids]
        @count = params[:count]
    end
end
