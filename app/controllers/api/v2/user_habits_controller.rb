class Api::V2::UserHabitsController < ApiController
  before_action :authenticate_user!

  def all
    render status: :ok, json: current_user.user_habits
  end

  def get_habit
    # Get the user habit by id
    user_habit = current_user.user_habits.find(params[:habitId])

    # Get the associated behavior map
    behavior_map = user_habit.curriculum_behavior_map

    # Return the user habit and behavior map as JSON
    render json: { user_habit: user_habit, behavior_map: behavior_map }, status: :ok
  end

  def behavior_maps
    behavior_id = params[:behaviorID]

    # Assuming you have a BehaviorMap model and behavior_id is a foreign key in behavior_maps table
    behavior_maps = Curriculum::BehaviorMap.where(behavior_id: behavior_id)
    puts behavior_maps

    render json: behavior_maps, status: :ok
  end

  def user_behavior_maps
    # Fetch the user habits for the current user
    user_habits = current_user.user_habits

    # Initialize an empty array to store the behavior maps
    behavior_maps = []

    # For each user habit, fetch the associated behavior map and append to the array
    user_habits.each do |user_habit|
      behavior_map = user_habit.curriculum_behavior_map
      behavior_maps.push(behavior_map)
    end

    # Return the behavior maps as JSON
    render json: behavior_maps, status: :ok
  end

  def create_or_destroy
    curriculum_behavior_map = Curriculum::BehaviorMap.find(params[:behavior_map_id])
    existing_user_habit = current_user.user_habits.find_by(curriculum_behavior_map: curriculum_behavior_map)

    if existing_user_habit
      existing_user_habit.destroy
      render json: { message: 'Existing habit has been deleted.' }, status: :ok
    else
      user_habit = current_user.user_habits.new(curriculum_behavior_map: curriculum_behavior_map)
      if user_habit.save
        render json: { message: 'Habit successfully saved.' }, status: :created
      else
        render json: { errors: user_habit.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
end


