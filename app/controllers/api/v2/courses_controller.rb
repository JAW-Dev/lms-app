class Api::V2::CoursesController < ApiController
  def index
    @courses = Curriculum::Course.includes(:behaviors).enabled.order(position: :asc)

    # Fetch the latest completed behavior
    if current_user
      latest_completed_behavior = current_user.viewed_behaviors
                                            .where(status: "completed")
                                            .order(updated_at: :desc)
                                            .first

      # Add this behavior to the response data
      response_data = CourseSerializer.new(@courses, current_user).as_json
    end

    # Set latest_completed data only if latest_completed_behavior exists
    if latest_completed_behavior
      response_data[:latest_completed] = latest_completed_behavior&.behavior&.as_json
      response_data[:latest_completed][:behavior_maps] = latest_completed_behavior&.behavior&.behavior_maps&.as_json
      response_data[:latest_completed][:course_id] = latest_completed_behavior&.behavior&.courses&.first&.id
    end

    render json: response_data, status: :ok
  end

  def show
    @course = Curriculum::Course.find(params[:id])
    render json: @course, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Course not found' }, status: :not_found
  end

end
