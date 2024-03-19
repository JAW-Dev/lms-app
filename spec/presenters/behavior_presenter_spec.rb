require 'rails_helper'

RSpec.describe Curriculum::BehaviorPresenter do
  it 'returns the correct length of time for a single video' do
    @behavior = create(:curriculum_behavior)
    @presented_behavior = Curriculum::BehaviorPresenter.new(@behavior)

    expect(@presented_behavior.video_time).to eq('4 minutes')
  end

  it 'returns unlocked behavior status for an unwatched behavior' do
    @user = create(:user)
    @course = create(:curriculum_course)
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
    @presented_behavior = Curriculum::BehaviorPresenter.new(@behavior)

    expect(@presented_behavior.status(@user)).to eq('unlocked unplayed')
  end

  it 'returns unlocked behavior status for a watched behavior' do
    @course = create(:curriculum_course)
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
    @user_behavior =
      create(:user_behavior, behavior: @behavior, status: :watched)
    @presented_behavior = Curriculum::BehaviorPresenter.new(@behavior)

    expect(@presented_behavior.status(@user_behavior.user)).to eq(
      'unlocked in-progress'
    )
  end

  it 'returns completed behavior status' do
    @course = create(:curriculum_course)
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
    @user_behavior =
      create(:user_behavior, behavior: @behavior, status: :completed)

    @presented_behavior = Curriculum::BehaviorPresenter.new(@behavior)
    expect(@presented_behavior.status(@user_behavior.user)).to eq(
      'unlocked completed'
    )
  end

  it 'returns the correct button text for a behavior (no user)' do
    @course = create(:curriculum_course)
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior

    @presented_behavior = Curriculum::BehaviorPresenter.new(@behavior)
    expect(@presented_behavior.watch_text(nil, @course)).to eq(
      'Sign Up to Watch'
    )
  end

  it 'returns the correct button text for a behavior (not enrolled)' do
    @course = create(:curriculum_course)
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
    @course2 = create(:curriculum_course)
    @course2.behaviors << @behavior
    @user = create(:user)

    @presented_behavior = Curriculum::BehaviorPresenter.new(@behavior)
    expect(@presented_behavior.watch_text(@user, @course2)).to eq('Purchase')
  end

  it 'returns the correct button text for an unwatched behavior' do
    @course = create(:curriculum_course)
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
    @user = create(:user)

    @presented_behavior = Curriculum::BehaviorPresenter.new(@behavior)
    expect(@presented_behavior.watch_text(@user, @course)).to eq('Start')
  end

  it 'returns the correct button text for an watched behavior' do
    @course = create(:curriculum_course)
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
    @user = create(:user)
    @user_behavior =
      create(:user_behavior, user: @user, behavior: @behavior, status: :watched)

    @presented_behavior = Curriculum::BehaviorPresenter.new(@behavior)
    expect(@presented_behavior.watch_text(@user, @course)).to eq('Continue')
  end
end
