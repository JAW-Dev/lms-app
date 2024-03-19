class Api::V2::HelpToHabitProgressesController < ApiController
  before_action :set_progress, only: [:update]

  def update
    render json: { error: "Failed to update progress" }, status: :unprocessable_entity if @progress.blank?

    if @progress.update(progress_params)
      # schedule/unschedule text job when is_active changes
      if @progress.saved_change_to_is_active?
        if @progress.is_active
          @progress.activate_texting(true, true)
          HelpToHabit.logger.info "#{current_user.email} resumed #{@progress.curriculum_behavior_id}"
        else
          @progress.cancel_texting
          HelpToHabit.logger.info "#{current_user.email} paused #{@progress.curriculum_behavior_id}"
        end
      end
      render json: { message: "Progress updated successfully" }, status: :ok
    else
      render json: { error: "Failed to update progress" }, status: :unprocessable_entity
    end
  end
  private

  def set_progress
    @progress = HelpToHabitProgress.find_by(user: current_user, id: params[:id])
  end

  def progress_params
    params.require(:help_to_habit_progress).permit(:is_active)
  end
end
