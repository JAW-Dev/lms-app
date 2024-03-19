class Admin::Curriculum::BehaviorOrdersController < Admin::AdminController
  include Pagy::Backend
  before_action :set_behavior_order, only: %i[edit update]
  load_and_authorize_resource class: 'BehaviorOrder'

  def index
    @search_term =
      params.dig(
        :q,
        :user_email_or_gift_recipient_email_or_gift_recipient_name_cont
      )
    @q =
      BehaviorOrder
        .complete
        .includes(:gift, [user: :profile])
        .where.not(gifts: { id: nil })
        .ransack(params[:q])
    @orders = @q.result.order(sold_at: :desc)
    @pagy, @orders = pagy(@orders)
  end

  def edit; end

  def update
    if @behavior_order.update(behavior_order_params)
      if @behavior_order.gift.recipient_email.present?
        Messenger.gift_confirmation(@behavior_order.gift).deliver_now
      end
      redirect_to curriculum_order_path(@behavior_order),
                  notice: 'Gift was successfully updated.'
    else
      redirect_to edit_admin_curriculum_behavior_order_path(@behavior_order),
                  alert: 'Error updating gift.'
    end
  end

  private

  def set_behavior_order
    @behavior_order = BehaviorOrder.friendly.find(params[:id])
    @gift = @behavior_order.gift
  end

  def behavior_order_params
    params
    .require(:behavior_order)
    .permit(
      gift_attributes: %i[id recipient_name recipient_email anonymous message expires_at]
    )
  end
end
