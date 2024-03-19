class Admin::Curriculum::BundlesController < Admin::AdminController
  before_action :set_bundle, only: %i[show edit update destroy]
  load_and_authorize_resource class: 'Curriculum::Bundle'

  def index
    @bundles = Curriculum::Bundle.order(name: :asc)
  end

  def show; end

  def new
    @bundle = Curriculum::Bundle.new
  end

  def create
    @bundle = Curriculum::Bundle.new(bundle_params)
    if @bundle.save
      redirect_to admin_curriculum_bundles_path,
                  notice: 'Bundle was successfully created.'
    else
      render :new
    end
  end

  def edit; end

  def update
    respond_to do |format|
      if @bundle.update(bundle_params)
        format.html do
          redirect_to admin_curriculum_bundles_path,
                      notice: 'Bundle was successfully updated.'
        end
        format.json { render status: :ok, json: { position: @course.position } }
      else
        format.html { render :edit }
        format.json do
          render status: :bad_request,
                 json: {
                   message: 'Error updating bundle.'
                 }
        end
      end
    end
  end

  private

  def set_bundle
    @bundle = Curriculum::Bundle.friendly.find(params[:id])
  end

  def bundle_params
    params
      .require(:curriculum_bundle)
      .permit(:name, :subheading, :sku, :description, :enabled, :image)
  end
end
