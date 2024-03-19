class VidyardService
  include HTTParty
  base_uri 'https://api.vidyard.com'

  def initialize(behavior)
    @behavior = behavior
    @options = {
      query: {
        auth_token:
          Rails.application.credentials[Rails.env.to_sym].dig(
            :vidyard,
            :api_key
          )
      },
      headers: {
        'Content-Type' => 'application/json'
      },
      format: :json
    }
  end

  def get_video_length
    player =
      self.class.get(
        "/dashboard/v1/players/uuid=#{@behavior.player_uuid}/",
        @options
      )
    begin
      player['length_in_seconds']
    rescue StandardError
      0
    end
  end
end
