class Admin::Curriculum::BehaviorMapsController < Admin::AdminController
  before_action :set_behavior, only: %i[index new create]
  before_action :set_behavior_map, only: %i[show edit update destroy]
  load_and_authorize_resource class: 'Curriculum::BehaviorMap'

  def index
    @behavior_maps = @behavior.behavior_maps
  end

  def show; end

  def new
    @behavior_map = Curriculum::BehaviorMap.new(behavior: @behavior)
  end

  def edit; end

  def create
    @behavior_map = Curriculum::BehaviorMap.new(behavior_map_params)
    @behavior_map.behavior = @behavior

    if @behavior_map.save
      redirect_to admin_curriculum_behavior_behavior_maps_path(
                    @behavior_map.behavior
                  ),
                  notice: 'Behavior map was successfully created.'
    else
      render :new
    end
  end

  def update
    respond_to do |format|
      if @behavior_map.update(behavior_map_params)
        format.html do
          redirect_to admin_curriculum_behavior_behavior_maps_path(
                        @behavior_map.behavior
                      ),
                      notice: 'Behavior map was successfully updated.'
        end
        format.json do
          render status: :ok, json: { position: @behavior_map.position }
        end
      else
        format.html { render :edit }
        format.json do
          render status: :bad_request,
                 json: {
                   message: 'Error updating behavior map.'
                 }
        end
      end
    end
  end

  def destroy
    @behavior_map.destroy
    redirect_to admin_curriculum_behavior_behavior_maps_path(
                  @behavior_map.behavior
                ),
                notice: 'Behavior map was successfully deleted.'
  end

  private

  def set_behavior
    @behavior = Curriculum::Behavior.friendly.find(params[:behavior_id])
  end

  def set_behavior_map
    @behavior_map = Curriculum::BehaviorMap.find(params[:id])
  end

  def behavior_map_params
    params
      .require(:curriculum_behavior_map)
      .permit(:behavior_id, :image, :remove_image, :description, :position)
  end
end
