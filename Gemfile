source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.0.0'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 6.1.7.1', '>= 6.0.3.4'
# Use postgresql as the database for Active Record
gem 'pg', '>= 0.18', '< 2.0'
# Use Puma as the app server
gem 'puma', '~> 3.11'
# Use SCSS for stylesheets
gem 'sass-rails', '>= 6'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker', '~> 5.0'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'json'
gem 'jbuilder', github: 'rails/jbuilder'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
gem 'bcrypt', '~> 3.1.7'
# Annotate models/specs
gem 'annotate'
# User authentication
gem 'devise'
gem 'omniauth'
gem 'omniauth-saml'
gem 'omniauth-rails_csrf_protection'
# SVG display
gem 'inline_svg'
# File uploads
gem 'carrierwave', '~> 1.0'
# Image processing
gem 'mini_magick'
# AWS integration
gem 'fog-aws'
# Model presenters
gem 'pres'
# User roles
gem 'rolify'
# Authorization
gem 'cancancan'
# URL slugs
gem 'friendly_id'
# Sortable objects
gem 'acts_as_list'
# Video processing
gem 'streamio-ffmpeg'
# Active link classes
gem 'active_link_to'
# Full text searching
gem 'pg_search'
# Currency handling
gem 'money-rails'
# Payment processing
# gem 'braintree', '~> 2.96.0'
gem 'stripe'
# ElasticSearch queries
gem 'elasticsearch'
# Email Delivery
gem 'mailgun-ruby',
    github: 'jhixson/mailgun-ruby',
    branch: 'feature/template-config'
# Meta tags
gem 'meta-tags'
# HTTP requests
gem 'httparty'
# Tax calculation
gem 'avatax'
# Date calculation
gem 'time_difference'
# Pagination
gem 'pagy', '~> 3.5'
# Static pages
gem 'high_voltage', '~> 3.1'
# Fix for links from MS Office applications
# https://docs.microsoft.com/en-us/office/troubleshoot/office-suite-issues/click-hyperlink-to-sso-website
gem 'fix_microsoft_links'
# Email token authentication
gem 'magic-link', github: 'jhixson/magic-link', branch: 'feature/en-locale'
# App monitoring
gem 'rollbar'
# Queue processing
gem 'sidekiq', '~> 6.5.9'
gem 'activejob-uniqueness'
# Searching/sorting
gem 'ransack', github: 'activerecord-hackery/ransack'
# Request throttling/blocking
gem 'rack-attack'
# Console formatting
gem 'awesome_print'
gem 'twilio-ruby'


# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.4', require: false

group :development, :test, :ci do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'database_cleaner'
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'webmock'
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'

  # Catch outgoing emails
  gem 'letter_opener'

  # Query optimization
  gem 'bullet', '6.1.3'
  gem 'guard-rspec'
  gem 'capistrano-bundler', require: false
  gem 'capistrano3-puma', require: false
  gem 'capistrano-rvm', require: false
  gem 'capistrano', '~> 3.10', require: false
  gem 'capistrano-rails', '~> 1.4', require: false
end

group :test, :ci do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'

  # Easy installation and use of chromedriver to run system tests with Chrome
  gem 'webdrivers', '~> 4.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem 'ed25519', '~> 1.2'

gem 'bcrypt_pbkdf', '~> 1.1'
