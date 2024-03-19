class Curriculum::BookSummariesController < ApplicationController
  def index
    @page = (params[:page] ||= 1).to_i
    @book_summaries, @pages =
      Curriculum::BookSummary.all(options query: { page: @page })
  end

  def show
    @book_summary = Curriculum::BookSummary.find_by_slug(params[:slug], options)
  end

  private

  def options(opts = {})
    if current_user.present? && !current_user.has_role?(:admin)
      return opts
    else
      {
        query: {
          status: %w[publish future draft private]
        },
        basic_auth: {
          username:
            Rails.application.credentials[Rails.env.to_sym].dig(
              :wordpress,
              :username
            ),
          password:
            Rails.application.credentials[Rails.env.to_sym].dig(
              :wordpress,
              :password
            )
        }
      }.merge!(opts)
    end
  end
end
