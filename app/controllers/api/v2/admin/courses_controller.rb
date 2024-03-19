class Api::V2::Admin::CoursesController < Api::V2::Admin::AdminController

    def get_courses
        courses = Curriculum::Course.all
        render json: courses, status: :ok
    end
end