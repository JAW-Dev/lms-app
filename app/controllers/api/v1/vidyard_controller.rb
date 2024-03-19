class Api::V1::VidyardController < ApiController
    include HTTParty
    base_uri 'https://api.vidyard.com'

    def create
        @id = vidyard_params[:id]
        @options = {
            query: {
                auth_token: Rails.application.credentials[Rails.env.to_sym].dig(:vidyard, :api_key)
            },
            headers: {
                'Content-Type' => 'application/json'
            },
            format: :json
        }
        player = self.class.get("/dashboard/v1/players/uuid=#{@id}/", @options)

        render json: player, status: :ok
    end

    private

    def vidyard_params
        params.require(:vidyard).permit(:id)
    end
end