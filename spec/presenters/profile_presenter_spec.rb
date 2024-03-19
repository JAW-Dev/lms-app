require 'rails_helper'

RSpec.describe ProfilePresenter do
  it 'returns a full name' do
    @profile = create(:profile, first_name: 'Joe', last_name: 'Fox')
    @presented_profile = ProfilePresenter.new(@profile)

    expect(@presented_profile.full_name).to eq('Joe Fox')
  end

  it 'removes extra spaces from a full name' do
    @profile = create(:profile, first_name: ' Kathleen ', last_name: ' Kelly ')
    @presented_profile = ProfilePresenter.new(@profile)

    expect(@presented_profile.full_name).to eq('Kathleen Kelly')
  end
end
