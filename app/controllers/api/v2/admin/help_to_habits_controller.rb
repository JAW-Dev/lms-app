class Api::V2::Admin::HelpToHabitsController < Api::V2::Admin::AdminController
    before_action :set_help_to_habit, only: %i[update]

    def create_new
        behavior = Curriculum::Behavior.find(params[:behavior_id])

        # Get the highest order currently in database
        max_order = behavior.help_to_habits.maximum(:order) || 0

        ActiveRecord::Base.transaction do
            params[:data].each_with_index do |h2h_params, index|
                behavior.help_to_habits.create!(content: h2h_params[:content], order: max_order + index + 1)
            end
        end

        render json: { message: 'HelpToHabit successfully created' }, status: :created
        rescue ActiveRecord::RecordInvalid => e
        render json: { message: 'Failed to create HelpToHabit', errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end

    def delete_help_to_habit
        puts "YO BRO"
        begin
                    puts "1"
            ActiveRecord::Base.transaction do
                puts "2"
            help_to_habit = HelpToHabit.find(params[:help_to_habit_id])
            behavior_id = help_to_habit.curriculum_behavior_id
            order = help_to_habit.order

                            puts "3"
            help_to_habit.destroy!

                            puts "4"
                            puts "order: #{order}"
                            puts "behavior_id: #{behavior_id}"
            # Pull up the remaining HelpToHabit objects
            remaining_help_to_habits = HelpToHabit.where("curriculum_behavior_id = ? AND \"order\" > ?", behavior_id, order)
                            puts "remaining_help_to_habits: #{remaining_help_to_habits}"
                            puts "remaining_help_to_habits count: #{remaining_help_to_habits.count}"
                            puts "5"
            remaining_help_to_habits.each do |help_to_habit|
                                puts "6"
                help_to_habit.update(order: help_to_habit.order - 1)
                                puts "7"
            end
        end
                        puts "8"

            render json: { message: 'HelpToHabit successfully deleted' }, status: :ok
        rescue ActiveRecord::RecordNotFound => e
            render json: { message: 'HelpToHabit not found', errors: e.message }, status: :not_found
        rescue => e
            render json: { message: 'Failed to delete HelpToHabit', errors: e.message }, status: :internal_server_error
        end
    end

    def update
      puts @help_to_habit.inspect
      puts help_to_habit_params.inspect
      if @help_to_habit.update(help_to_habit_params)
        render json: { message: 'HelpToHabit successfully updated' }, status: :ok
      else
            render json: { message: 'Failed to update HelpToHabit', errors: @help_to_habit.errors.full_messages.join(", ") }, status: :internal_server_error
      end
    end

    def update_order
        ordering = help_to_habit_params[:reorder]
        begin
            HelpToHabit.update(ordering.keys, ordering.values)
            render json: { message: 'HelpToHabit order updated' }, status: :ok
        rescue => e
            render json: { message: 'Failed to update HelpToHabit order', errors: e.message }, status: :internal_server_error
        end
    end

    private

    def set_help_to_habit
      @help_to_habit = HelpToHabit.find(params[:id])
    end

    def help_to_habit_params
      params.require(:help_to_habit).permit(:content, :reorder => {})
    end
end
