AvaTax.configure do |config|
  config.endpoint =
    Rails.application.credentials[Rails.env.to_sym].dig(:avalara, :api_url)
  config.username =
    Rails.application.credentials[Rails.env.to_sym].dig(:avalara, :username)
  config.password =
    Rails.application.credentials[Rails.env.to_sym].dig(:avalara, :password)
end
