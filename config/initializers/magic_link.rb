require 'magic/link/magic_link'

Magic::Link.configure do |config|
  config.email_from = 'Admired Leadership <no-reply@mg.admiredleadership.com>'
end

Magic::Link::MagicLink.include Extensions::Magic::Link::MagicLink
