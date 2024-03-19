CarrierWave.configure do |config|
  config.fog_provider = 'fog/aws'
  config.fog_credentials = {
    provider: 'AWS',
    aws_access_key_id:
      Rails.application.credentials.dig(:spaces, :access_key_id),
    aws_secret_access_key:
      Rails.application.credentials.dig(:spaces, :secret_access_key),
    host: 'nyc3.digitaloceanspaces.com',
    endpoint: 'https://nyc3.digitaloceanspaces.com'
  }

  config.fog_directory = 'cra-assets'
  config.fog_public = false
  config.fog_attributes = { cache_control: "public, max-age=#{365.days.to_i}" } # optional, defaults to {}

  config.storage = Rails.env.production? ? :fog : :file

  if Rails.env.test? || Rails.env.ci?
    config.cache_dir = "#{Rails.root}/spec/support/uploads/tmp"
  end
end
