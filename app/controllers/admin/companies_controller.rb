class Admin::CompaniesController < Admin::AdminController
  include Pagy::Backend
  before_action :set_company, only: %i[users show edit update destroy]
  load_and_authorize_resource

  def index
    @search_term = params[:q]
    @companies =
      if @search_term.present?
        Company.includes(:state).search_for(@search_term)
      else
        Company.includes(:state, :country)
      end
  end

  def users
    @search_term = params[:q]
    @users =
      if @search_term.present?
        @company.users.includes(:profile).search_for(@search_term)
      else
        @company.users.includes(:profile).order('profiles.last_name asc')
      end
    @pagy, @users = pagy(@users)
    render 'admin/users/index'
  end

  def show; end

  def new
    @company = Company.new(country: Country.find_by_alpha2('US'))
  end

  def edit; end

  def create
    @company = Company.new(company_params)
    if @company.save
      redirect_to admin_companies_path,
                  notice: 'Company was successfully created.'
    else
      render :new
    end
  end

  def update
    if @company.update(company_params)
      redirect_to admin_companies_path,
                  notice: 'Company was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @company.destroy
    redirect_to admin_companies_path,
                notice: 'Company was successfully deleted.'
  end

  private

  def set_company
    @company = Company.friendly.find(params[:id])
  end

  def company_params
    params
      .require(:company)
      .permit(
        :name,
        :line_one,
        :line_two,
        :city,
        :state_id,
        :country_id,
        :zip,
        :phone
      )
  end
end
