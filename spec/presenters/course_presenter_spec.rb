require 'rails_helper'

RSpec.describe Curriculum::CoursePresenter do
  describe do
    before :each do
      @user = create(:user)
      @course = create(:curriculum_course)
      @behavior1 = create(:curriculum_behavior)
      @behavior2 = create(:curriculum_behavior)
      @course.behaviors += [@behavior1, @behavior2]
    end

    it 'returns a count of course behaviors' do
      @presented_course = Curriculum::CoursePresenter.new(@course)

      expect(@presented_course.video_count).to eq('2 videos')
    end

    it 'returns the correct length of time' do
      @presented_course = Curriculum::CoursePresenter.new(@course)

      expect(@presented_course.total_time).to eq('8 minutes')
    end

    it 'returns the correct progress percentage (no behavior videos completed)' do
      @behavior3 = create(:curriculum_behavior)
      @course.behaviors << @behavior3
      @presented_course = Curriculum::CoursePresenter.new(@course)

      expect(@presented_course.progress_percent(@user)).to eq('0%')
    end

    it 'returns the correct progress percentage (1/3 behavior videos completed)' do
      @behavior3 = create(:curriculum_behavior)
      @course.behaviors << @behavior3
      @presented_course = Curriculum::CoursePresenter.new(@course)

      create(
        :user_behavior,
        user: @user,
        behavior: @behavior1,
        status: :completed
      )
      @presented_course = Curriculum::CoursePresenter.new(@course)

      expect(@presented_course.progress_percent(@user)).to eq('33%')
    end

    it 'returns the correct progress percentage (2/3 behavior videos completed)' do
      @behavior3 = create(:curriculum_behavior)
      @course.behaviors << @behavior3

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
      @presented_course = Curriculum::CoursePresenter.new(@course)

      expect(@presented_course.progress_percent(@user)).to eq('67%')
    end

    it 'returns the correct progress percentage (3/3 behavior videos completed)' do
      @behavior3 = create(:curriculum_behavior)
      @course.behaviors << @behavior3

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
      create(
        :user_behavior,
        user: @user,
        behavior: @behavior3,
        status: :completed
      )
      @presented_course = Curriculum::CoursePresenter.new(@course)

      expect(@presented_course.progress_percent(@user)).to eq('100%')
    end

    it 'returns the correct progress percentage (2/4 behavior videos completed)' do
      @behavior3 = create(:curriculum_behavior)
      @behavior4 = create(:curriculum_behavior)
      @course.behaviors += [@behavior3, @behavior4]

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
      @presented_course = Curriculum::CoursePresenter.new(@course)

      expect(@presented_course.progress_percent(@user)).to eq('50%')
    end

    it 'returns the correct progress percentage (3/4 behavior videos completed)' do
      @behavior3 = create(:curriculum_behavior)
      @behavior4 = create(:curriculum_behavior)
      @course.behaviors += [@behavior3, @behavior4]

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
      create(
        :user_behavior,
        user: @user,
        behavior: @behavior3,
        status: :completed
      )
      @presented_course = Curriculum::CoursePresenter.new(@course)

      expect(@presented_course.progress_percent(@user)).to eq('75%')
    end

    it 'returns the correct progress percentage (4/4 behavior videos completed)' do
      @behavior3 = create(:curriculum_behavior)
      @behavior4 = create(:curriculum_behavior)
      @course.behaviors += [@behavior3, @behavior4]

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
      create(
        :user_behavior,
        user: @user,
        behavior: @behavior3,
        status: :completed
      )
      create(
        :user_behavior,
        user: @user,
        behavior: @behavior4,
        status: :completed
      )
      @presented_course = Curriculum::CoursePresenter.new(@course)

      expect(@presented_course.progress_percent(@user)).to eq('100%')
    end
  end

  it 'returns the correct button text for a course (no user)' do
    @course = create(:curriculum_course)
    @presented_course = Curriculum::CoursePresenter.new(@course)

    expect(@presented_course.watch_text(nil)).to eq('Sign Up to Get Access')
  end

  it 'returns the correct button text for a course (not enrolled)' do
    @course = create(:curriculum_course)
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
    @course2 = create(:curriculum_course)
    @course2.behaviors << @behavior
    @user = create(:user)
    @presented_course = Curriculum::CoursePresenter.new(@course2)

    expect(@presented_course.watch_text(@user)).to eq('Learn More')
  end

  it 'returns the correct button text for a course (enrolled, not watched)' do
    @course = create(:curriculum_course)
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
    @user = create(:user)
    @presented_course = Curriculum::CoursePresenter.new(@course)

    expect(@presented_course.watch_text(@user)).to eq('Start')
  end

  it 'returns the correct button text for a course (enrolled, watched)' do
    @course = create(:curriculum_course)
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
    @user = create(:user)
    create(:user_behavior, behavior: @behavior, user: @user, status: :watched)
    @presented_course = Curriculum::CoursePresenter.new(@course)

    expect(@presented_course.watch_text(@user)).to eq('Continue')
  end

  it 'returns the correct button text for a course (enrolled, completed)' do
    @course = create(:curriculum_course)
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
    @user = create(:user)
    create(:user_behavior, behavior: @behavior, user: @user, status: :completed)
    @presented_course = Curriculum::CoursePresenter.new(@course)

    expect(@presented_course.watch_text(@user)).to eq('Review')
  end

  # it "returns the correct number for a course" do
  #   @course = create(:curriculum_course)
  #   @user = create(:user)
  #   @presented_course = Curriculum::CoursePresenter.new(@course)

  #   expect(@presented_course.number(0)).to include("fa")
  #   expect(@presented_course.number(1)).to eq(1)
  #   expect(@presented_course.number(2)).to eq(2)
  # end
end
