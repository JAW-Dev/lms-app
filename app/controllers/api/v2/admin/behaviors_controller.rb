class Api::V2::Admin::BehaviorsController < Api::V2::Admin::AdminController
  before_action :set_progress, only: [:show, :update]

  def get_behaviors
    behavior = Curriculum::Behavior.all
    render json: behavior, status: :ok
  end
        
  def show
  end

  def update
    if @behavior.update(behavior_params)
      if @behavior.saved_change_to_h2h_status?
        if @behavior.active?
          # requeue all progresses
          reminders = @behavior.help_to_habit_progresses.where(is_active: false, queue_position: 1)
          reminders.each do |reminder|
            reminder.activate_texting(true, true)
            reminder.update(is_active: true)
            HelpToHabit.logger.info "reminders for behavior #{@behavior.id} resumed for #{reminder.user.email}"
          end
          render json: { message: "H2H for behavior #{@behavior.id} active" }, status: :ok
        else
          # dequeue all progresses
          reminders = @behavior.help_to_habit_progresses.where(is_active: true, queue_position: 1)
          reminders.each do |reminder|
            reminder.cancel_texting
            reminder.update(is_active: false)
            HelpToHabit.logger.info "reminders for behavior #{@behavior.id} paused for #{reminder.user.email}"
          end
          render json: { message: "H2H for behavior #{@behavior.id} inactive" }, status: :ok
        end
      end
    else
      render json: { error: "Failed to update behavior" }, status: :unprocessable_entity
    end
  end

  private

  def set_progress
    @behavior = Curriculum::Behavior.find(params[:id])
  end

  def behavior_params
    params.require(:curriculum_behavior).permit(:h2h_status)
  end
end 
