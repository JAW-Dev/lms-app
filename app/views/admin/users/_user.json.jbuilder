json.extract! user, :email, :slug, :created_at, :updated_at
present(user.profile) { |profile| json.name profile.full_name }
json.url user_url(user, format: :json)
