class Curriculum::SubscriptionOrdersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_subscription_order, except: %i[index new]
  load_and_authorize_resource class: 'SubscriptionOrder'

  def update
    respond_to do |format|
      if @subscription_order.update(subscription_order_params)
        format.json { render status: :ok, json: { message: 'Order updated.' } }
      else
        format.json do
          render status: :bad_request,
                 json: {
                   message: 'Error updating order.'
                 }
        end
      end
    end
  end

  private

  def set_subscription_order
    @subscription_order = SubscriptionOrder.friendly.find(params[:id])
  end

  def subscription_order_params
    params.require(:subscription_order).permit(:reminder, :status)
  end
end
