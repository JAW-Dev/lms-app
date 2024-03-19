require 'rails_helper'

RSpec.describe PaymentService do
  before(:each) do
    @user = create(:user)
    @user.confirm

    @user.user_invite =
      UserInvite.new(
        user: @user,
        status: :active,
        email: @user.email,
        access_type: :unlimited,
        expires_at: DateTime.now
      )

    @order = create(:course_order, user: @user)
    @subscription_order = create(:subscription_order, user: @user)
  end

  it 'returns a result hash after processing a sale' do
    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    expect(result.class).to be(Hash)
  end

  it 'updates an order status if successful' do
    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    expect(result[:success]).to be(true)
    expect(@order.reload.complete?).to be(true)
  end

  it "doesn't update an order status if unsuccessful" do
    processor = PaymentService.new('FailProcessor')
    begin
      result = processor.process_sale(@order)
      expect(result[:success]).to be(false)
    rescue => e
      expect(e.class).to be(PaymentError)
      expect(@order.reload.pending?).to be(true)
    end
  end

  # it "updates invitation expiration date if successful" do
  #   processor = PaymentService.new('SuccessProcessor')
  #   result = processor.process_subscription(@subscription_order)

  #   expect(result[:success]).to be(true)
  #   expect(@user.user_invite.expires_at).to be > DateTime.now
  # end
end
