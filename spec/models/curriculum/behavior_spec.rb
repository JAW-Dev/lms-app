# == Schema Information
#
# Table name: curriculum_behaviors
#
#  id             :bigint(8)        not null, primary key
#  audio_uuid     :string
#  description    :text
#  enabled        :boolean          default(FALSE)
#  example_image  :string
#  exercise_image :string
#  player_uuid    :string
#  poster         :string
#  price_cents    :integer          default(0), not null
#  price_currency :string           default("USD"), not null
#  sku            :string
#  slug           :string
#  subtitle       :string
#  title          :string
#  video_length   :float            default(0.0)
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

require 'rails_helper'

RSpec.describe Curriculum::Behavior, type: :model do
  it 'has a valid factory' do
    expect(create(:curriculum_behavior)).to be_valid
  end

  it 'is invalid without a title' do
    expect(build(:curriculum_behavior, title: nil)).to be_invalid
  end

  it 'is invalid without a sku' do
    expect(build(:curriculum_behavior, sku: nil)).to be_invalid
  end

  it 'is invalid with a duplicate sku' do
    behavior = create(:curriculum_behavior)
    expect(build(:curriculum_behavior, sku: behavior.sku)).to be_invalid
  end

  it 'is completed when a user has viewed the entire behavior' do
    @behavior = create(:curriculum_behavior)
    @user = create(:user)
    create(:user_behavior, user: @user, behavior: @behavior, status: :completed)
    expect(@behavior.completed?(@user)).to be(true)
  end
end
