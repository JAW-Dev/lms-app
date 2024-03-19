class Admin::Curriculum::OrdersController < Admin::AdminController
  include Pagy::Backend
  load_and_authorize_resource class: 'Order'

  def index
    respond_to do |format|
      format.html do
        @search_term = params.dig(:q, :user_email_cont)
        order_scope =
          params[:renewals] == 'true' ? SubscriptionOrder : CourseOrder
        @q = order_scope.complete.ransack(params[:q])
        @orders = @q.result.order(sold_at: :desc)
        @pagy, @orders = pagy(@orders)
      end
      format.csv do
        type = params[:type]&.to_sym || :all
        time = params[:t] || DateTime.now.strftime('%s')
        date_str = DateTime.now.strftime('%Y-%m-%d')
        send_file(
          OrderService.export(type: type),
          filename: "orders_#{type}_#{date_str}_#{time}.csv"
        )
      end
    end
  end
end
