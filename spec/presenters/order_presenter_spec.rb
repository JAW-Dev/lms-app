require 'rails_helper'

RSpec.describe OrderPresenter do
  it 'returns the correct title and sku (CourseOrder)' do
    order = create(:course_order)
    presented_order = OrderPresenter.new(order)

    expect(presented_order.title).to eq(
      'Complete 10-Module Admired Leadership Access'
    )
    expect(presented_order.sku).to eq('STE0001')
  end

  it 'returns the correct title and sku (BehaviorOrder)' do
    course = create(:curriculum_course)
    behavior =
      create(:curriculum_behavior, title: 'Test Behavior', sku: 'BEH123')
    course.behaviors << behavior
    order = build(:behavior_order)
    order.behaviors = [behavior]
    order.save
    presented_order = OrderPresenter.new(order)

    expect(presented_order.title).to eq('Test Behavior')
    expect(presented_order.sku).to eq('BEH123')
  end
end
