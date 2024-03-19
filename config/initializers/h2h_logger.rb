# frozen_string_literal: true

class H2HLogger < ActiveSupport::Logger
  def initialize
    super(Rails.root.join('log', 'h2h.log'))
    self.level = Logger::INFO
    self.formatter = H2HLogFormatter.new
  end

end

class H2HLogFormatter
  def call(_severity, timestamp, _progname, msg)
    "#{timestamp.strftime('%Y-%m-%d %H:%M:%S')} #{msg}\n"
  end
end
