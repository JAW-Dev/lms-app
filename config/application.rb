require_relative 'boot'

require 'rails'
require 'rails/all'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
require 'active_storage/engine'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_mailbox/engine'
require 'action_text/engine'
require 'action_view/railtie'
require 'action_cable/engine'
require 'sprockets/railtie'
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module AdmiredLeadership
  class Application < Rails::Application
    config.action_view.sanitized_allowed_tags = ['u']
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    config.features = config_for(:features)
    config.autoload_paths << "#{Rails.root}/app/serializers"

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    # Don't generate system test files.
    config.generators.system_tests = nil
    config.active_record.use_yaml_unsafe_load = true

    config.generators do |g|
      g.test_framework :rspec,
                       controller_specs: false,
                       helper_specs: false,
                       request_specs: false,
                       routing_specs: false,
                       view_specs: false
    end

    config.action_dispatch.default_headers = { 'X-Frame-Options' => 'DENY' }

    config.exceptions_app = self.routes
  end
end
