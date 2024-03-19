class Api::V2::Admin::HelpToHabitExtrasController < Api::V2::Admin::AdminController
  before_action :set_behavior, only: %i[create]
  before_action :set_extra, only: %i[update]

  def create
    @extra = HelpToHabitExtra.new(extra_params)
    @extra.behavior = @behavior

    if @extra.save
      render json: { message: 'HelpToHabitExtra successfully created' }, status: :ok
    else
      render json: { message: 'Failed to create HelpToHabitExtra', errors: @extra.errors.full_messages.join(", ") }, status: :internal_server_error
    end
  end

  def update
    if @extra.update(extra_params)
      render json: { message: 'HelpToHabitExtra successfully updated' }, status: :ok
    else
      render json: { message: 'Failed to update HelpToHabitExtra', errors: @extra.errors.full_messages.join(", ") }, status: :internal_server_error
    end
  end

  private

  def set_behavior
    @behavior = Curriculum::Behavior.find(params[:behavior_id])
  end

  def set_extra
    @extra = HelpToHabitExtra.find(params[:id])
  end

  def extra_params
    params.require(:help_to_habit_extra).permit(:content, :placement)
  end
end
