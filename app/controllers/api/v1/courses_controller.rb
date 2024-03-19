class Api::V1::CoursesController < ApiController
    def create
        @id = course_params[:id]
        return render status: :bad_request, json: { message: 'Error.' } if @id.blank?

        @behaviors = Curriculum::Course.find(@id).behaviors.enabled
        puts @behaviors.inspect

        render json: @behaviors, status: :ok
    end

    private

    def course_params
        params.require(:course).permit(:id)
    end

end 