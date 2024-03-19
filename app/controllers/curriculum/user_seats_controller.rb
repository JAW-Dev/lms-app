class Curriculum::UserSeatsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_order, only: %i[index create]
  before_action :set_user_seat, only: %i[update destroy]
  load_and_authorize_resource class: 'UserSeat'

  def index
    @user_seats = @order.user_seats.includes(:user).order(invited_at: :desc)
    @remaining = @order.qty > 1 ? @order.qty - @user_seats.count : 0
  end

  def create
    @user_seat = UserSeat.new(user_seat_params)
    @user_seat.order = @order
    @user_seat.invited_at = DateTime.now
    if @user_seat.save
      redirect_to curriculum_user_seats_path(@order), status: :see_other
    else
      render status: :bad_request,
             json: {
               message: 'Error adding seat.',
               errors: @user_seat.errors.full_messages
             }
    end
  end

  def update
    if @user_seat.update(user_seat_params)
      redirect_to curriculum_user_seats_path(@user_seat.order),
                  status: :see_other
    else
      render status: :bad_request, json: { message: 'Error updating seat.' }
    end
  end

  def destroy
    RegistrationService.new(@user_seat.user).deactivate_seat(@user_seat)
    @user_seat.destroy
    redirect_to curriculum_user_seats_path(@user_seat.order), status: :see_other
  end

  private

  def set_order
    @order = Order.friendly.find(params[:id])
  end

  def set_user_seat
    @user_seat = UserSeat.find(params[:id])
  end

  def user_seat_params
    params.require(:user_seat).permit(:id, :email, :status, :invited_at)
  end
end
