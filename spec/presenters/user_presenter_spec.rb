require 'rails_helper'

RSpec.describe UserPresenter do
  it 'returns a behavior status' do
    @user_behavior = create(:user_behavior, status: :watched)
    @presented_user = UserPresenter.new(@user_behavior.user)

    expect(@presented_user.video_status(@user_behavior.behavior)).to eq(
      'watched'
    )
  end

  it 'returns a default behavior status' do
    @user = create(:user)
    @behavior = create(:curriculum_behavior)

    @presented_user = UserPresenter.new(@user)

    expect(@presented_user.video_status(@behavior)).to eq('unwatched')
  end

  it "returns the first behavior as next up when the user hasn't watched any behavior videos" do
    @user = create(:user)
    @course = create(:curriculum_course)
    @behavior1 = create(:curriculum_behavior)
    @behavior2 = create(:curriculum_behavior)
    @course.behaviors += [@behavior1, @behavior2]

    @presented_user = UserPresenter.new(@user)

    expect(@presented_user.next_behavior(@course)).to eq(@behavior1)
  end

  it 'returns the behavior as next up when the user has watched it previously' do
    @user = create(:user)
    @course = create(:curriculum_course)
    @behavior1 = create(:curriculum_behavior)
    @behavior2 = create(:curriculum_behavior)
    @course.behaviors += [@behavior1, @behavior2]
    create(:user_behavior, user: @user, behavior: @behavior1, status: :watched)

    @presented_user = UserPresenter.new(@user)

    expect(@presented_user.next_behavior(@course)).to eq(@behavior1)
  end

  it 'returns the next behavior as next up when the user completes the previous behavior video' do
    @user = create(:user)
    @course = create(:curriculum_course)
    @behavior1 = create(:curriculum_behavior)
    @behavior2 = create(:curriculum_behavior)
    @course.behaviors += [@behavior1, @behavior2]
    create(
      :user_behavior,
      user: @user,
      behavior: @behavior1,
      status: :completed
    )

    @presented_user = UserPresenter.new(@user)

    expect(@presented_user.next_behavior(@course)).to eq(@behavior2)
  end

  it 'returns the first behavior as next up when the user completes all behavior videos' do
    @user = create(:user)
    @course = create(:curriculum_course)
    @behavior1 = create(:curriculum_behavior)
    @behavior2 = create(:curriculum_behavior)
    @course.behaviors += [@behavior1, @behavior2]
    create(
      :user_behavior,
      user: @user,
      behavior: @behavior1,
      status: :completed
    )
    create(
      :user_behavior,
      user: @user,
      behavior: @behavior2,
      status: :completed
    )

    @presented_user = UserPresenter.new(@user)

    expect(@presented_user.next_behavior(@course)).to eq(@behavior1)
  end
end
