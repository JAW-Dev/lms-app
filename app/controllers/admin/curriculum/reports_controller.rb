class Admin::Curriculum::ReportsController < Admin::AdminController
  def index; end

  def show
    report = params[:id]
    start_date = params[:start].present? ? Date.parse(params[:start]) : nil
    end_date = params[:end].present? ? Date.parse(params[:end]) : nil
    reporter =
      if start_date && end_date
        ReportService.new(start_date, end_date)
      else
        ReportService.new
      end
    begin
      result = reporter.send(report)
      render json: result
    rescue NoMethodError => exception
      render json: []
    end
  end
end
