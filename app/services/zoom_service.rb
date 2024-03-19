module ZoomService
  def get_signature(options = {})
    time = (Time.now.to_i * 1000 - 30_000).to_s
    data =
      Base64.urlsafe_encode64(
        options[:api_key] + options[:meeting_number] + time +
          options[:role].to_s
      )
    hash =
      Base64.urlsafe_encode64(
        OpenSSL::HMAC.digest(
          OpenSSL::Digest.new('sha256'),
          options[:api_secret],
          data
        )
      )
    tempStr =
      options[:api_key] + '.' + options[:meeting_number] + '.' + time + '.' +
        options[:role].to_s + '.' + hash
    return(
      Base64
        .urlsafe_encode64(tempStr)
        .gsub('+', '-')
        .gsub('/', '_')
        .gsub(/#{Regexp.escape('=')}+$/, '')
    )
  end

  extend self
end
