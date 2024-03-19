class Admin::Curriculum::BundleCoursesController < Admin::AdminController
  def index
    @bundle = Curriculum::Bundle.friendly.find(params[:bundle_id])
    @courses = Curriculum::Course.order(position: :asc)
  end
end
