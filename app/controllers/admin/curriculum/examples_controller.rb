class Admin::Curriculum::ExamplesController < Admin::AdminController
  before_action :set_behavior, only: %i[index new create]
  before_action :set_example, only: %i[show edit update destroy]
  load_and_authorize_resource class: 'Curriculum::Example'

  def index
    @examples = @behavior.examples
  end

  def show; end

  def new
    @example = Curriculum::Example.new(behavior: @behavior)
  end

  def edit; end

  def create
    @example = Curriculum::Example.new(example_params)
    @example.behavior = @behavior

    if @example.save
      redirect_to admin_curriculum_behavior_examples_path(@example.behavior),
                  notice: 'Example was successfully created.'
    else
      render :new
    end
  end

  def update
    respond_to do |format|
      if @example.update(example_params)
        format.html do
          redirect_to admin_curriculum_behavior_examples_path(
                        @example.behavior
                      ),
                      notice: 'Example was successfully updated.'
        end
        format.json do
          render status: :ok, json: { position: @example.position }
        end
      else
        format.html { render :edit }
        format.json do
          render status: :bad_request,
                 json: {
                   message: 'Error updating example.'
                 }
        end
      end
    end
  end

  def destroy
    @example.destroy
    redirect_to admin_curriculum_behavior_examples_path(@example.behavior),
                notice: 'Example was successfully deleted.'
  end

  private

  def set_behavior
    @behavior = Curriculum::Behavior.friendly.find(params[:behavior_id])
  end

  def set_example
    @example = Curriculum::Example.find(params[:id])
  end

  def example_params
    params
      .require(:curriculum_example)
      .permit(:behavior_id, :description, :position)
  end
end
