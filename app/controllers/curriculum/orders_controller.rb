class Curriculum::OrdersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_order, except: %i[index new]
  after_action :clear_cookie, only: [:show], unless: -> { request.format.json? }
  load_and_authorize_resource class: 'Order'

  def index
    @orders = current_user.orders.complete.order(sold_at: :desc)
  end

  def show
    respond_to do |format|
      format.html do
        unless @order.complete?
          if @order.is_a?(BehaviorOrder)
            redirect_to new_curriculum_order_path(
                          course: @order.courses.first.slug,
                          behavior: @order.behaviors.first.slug
                        )
          elsif @order.is_a?(BundleOrder)
            return(
              redirect_to new_curriculum_order_path(
                            course: @order.courses.first.slug
                          )
            )
          else
            return redirect_to new_curriculum_order_path
          end
        end
      end
      format.json do
        begin
          payment = PaymentService.new(@order.processor)
          @token = @order.pending? ? payment.fetch_token : nil
        rescue StandardError
          render status: :bad_request,
                 json: {
                   token: nil,
                   message: 'Error fetching token.'
                 }
        end
      end
    end
  end

  def new
    @course = Curriculum::Course.friendly.find(params[:course]) if params[
      :course
    ].present?
    @behavior = Curriculum::Behavior.friendly.find(params[:behavior]) if params[
      :behavior
    ].present?

    if @behavior.present?
      @order = BehaviorOrder.new
      @order.courses = [@course]
      @order.behaviors = [@behavior]
    elsif params[:order_type] == 'subscription'
      @order = SubscriptionOrder.new
      @order.courses = Curriculum::Course.modules.enabled
      @order.behaviors = []
    else
      @order = CourseOrder.new
      @order.courses = Curriculum::Course.modules.enabled
      @order.behaviors = []
    end

    processor =
      if @order.is_a?(BehaviorOrder) && current_user.has_free_gift?
        'Free'
      else
        'Stripe'
      end
    @order.update(user: current_user, processor: processor)
    cookies[:cra_transaction] = {
      value: @order.slug,
      expires: 30.days.from_now
    }
  end

  def update
    if @order.update(order_params)
      tax_service = TaxService.new(@order)
      if @order.pending? && @order.total.nonzero?
        @order.update(sales_tax: tax_service.calculate_tax)
      end
      if @order.pending? && @order.billing_address.present? &&
           @order.is_a?(SubscriptionOrder)
        PaymentService.new(@order.processor).create_customer(@order)
      end
      if @order.nonce.present?
        begin
          result = PaymentService.new(@order.processor).process_sale(@order)
          if result[:success] && @order.total.nonzero?
            tax_service.submit_transaction
            AccessExpirationJob.set(wait: 1.year).perform_later(@order.user.id)
          end
          return(
            render status: :ok,
                   json: {
                     transaction_id: result[:transaction_id],
                     success: result[:success],
                     status: result[:status],
                     sold_at: @order.sold_at
                   }
          )
        rescue PaymentError => e
          return(
            render status: :bad_request,
                   json: {
                     transaction_id: nil,
                     success: false,
                     status: @order.status,
                     message: e
                   }
          )
        end
      elsif @order.payment_method_id.present?
        begin
          PaymentService
            .new(@order.processor)
            .add_payment_method(
              @order.payment_method_id,
              @order.user.customer_id
            )
          result =
            PaymentService.new(@order.processor).process_subscription(@order)
          if result[:success] && @order.total.nonzero?
            tax_service.submit_transaction
            AccessExpirationJob.set(wait: 1.year).perform_later(@order.user.id)
          end
          return(
            render status: :ok,
                   json: {
                     transaction_id: result[:id],
                     success: result[:success],
                     status: result[:status],
                     sold_at: @order.sold_at
                   }
          )
        rescue PaymentError => e
          return(
            render status: :bad_request,
                   json: {
                     transaction_id: nil,
                     success: false,
                     status: @order.status,
                     message: e
                   }
          )
        end
      end
    else
      @order.reload
    end
    return render :show
  end

  private

  def set_order
    @order = Order.friendly.find(params[:id])
  end

  def clear_cookie
    if cookies[:cra_transaction] == @order.slug && @order.complete?
      cookies.delete(:cra_transaction)
    end
  end

  def order_params
    params
      .require(:order)
      .permit(
        :id,
        :nonce,
        :qty,
        :status,
        :payment_method_id,
        billing_address_attributes: %i[
          id
          full_name
          company_name
          line1
          line2
          country_alpha2
          city
          state_abbr
          zip
        ],
        gift_attributes: %i[id recipient_name recipient_email anonymous message expires_at]
      )
  end
end
