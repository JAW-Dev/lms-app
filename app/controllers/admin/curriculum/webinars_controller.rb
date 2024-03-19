class Admin::Curriculum::WebinarsController < Admin::AdminController
  before_action :set_webinar, only: %i[show edit update destroy]
  load_and_authorize_resource class: 'Curriculum::Webinar'

  def index
    @webinars = Curriculum::Webinar.order(presented_at: :desc)
  end

  def show; end

  def new
    @webinar = Curriculum::Webinar.new
  end

  def edit; end

  def create
    @webinar = Curriculum::Webinar.new(webinar_params)

    if @webinar.save
      redirect_to admin_curriculum_webinars_path,
                  notice: 'Webinar was successfully created.'
    else
      render :new
    end
  end

  def update
    respond_to do |format|
      if @webinar.update(webinar_params)
        format.html do
          redirect_to admin_curriculum_webinars_path,
                      notice: 'Webinar was successfully updated.'
        end
        format.json do
          render status: :ok, json: { position: @webinar.position }
        end
      else
        format.html { render :edit }
        format.json do
          render status: :bad_request,
                 json: {
                   message: 'Error updating webinar.'
                 }
        end
      end
    end
  end

  def destroy
    @webinar.destroy
    redirect_to admin_curriculum_webinars_path,
                notice: 'Webinar was successfully deleted.'
  end

  private

  def set_webinar
    @webinar = Curriculum::Webinar.friendly.find(params[:id])
  end

  def webinar_params
    params
      .require(:curriculum_webinar)
      .permit(
        :title,
        :subtitle,
        :description,
        :player_uuid,
        :audio_uuid,
        :enabled,
        :presented_at,
        :registration_link
      )
      .tap do |whitelist|
        Time.zone = 'Eastern Time (US & Canada)'
        if whitelist[:presented_at]
          whitelist[:presented_at] =
            Time.zone.local_to_utc(whitelist[:presented_at])
        end
      end
  end
end
