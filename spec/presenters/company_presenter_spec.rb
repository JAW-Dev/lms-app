require 'rails_helper'

RSpec.describe CompanyPresenter do
  it 'returns a full address (USA)' do
    usa = create(:country, name: 'United States', alpha2: 'US')
    pa = create(:state, name: 'Pennsylvania', abbr: 'PA', country: usa)
    @company = create(:company, country: usa, state: pa)
    @presented_company = CompanyPresenter.new(@company)

    expect(@presented_company.full_address).to eq(
      "#{@company.line_one}<br />#{@company.line_two}<br />#{@company.city}, PA #{@company.zip}"
    )
  end

  it 'returns a full address (Canada)' do
    ca = create(:country, name: 'Canada', alpha2: 'CA')
    on = create(:state, name: 'Ontario', abbr: 'ON', country: ca)
    @company = create(:company, country: ca, state: on)
    @presented_company = CompanyPresenter.new(@company)

    expect(@presented_company.full_address).to eq(
      "#{@company.line_one}<br />#{@company.line_two}<br />#{@company.city}, ON #{@company.zip}"
    )
  end

  it 'returns a full address (International)' do
    @company = create(:company, state: nil)
    @presented_company = CompanyPresenter.new(@company)

    expect(@presented_company.full_address).to eq(
      "#{@company.line_one}<br />#{@company.line_two}<br />#{@company.city} #{@company.zip}, #{@company.country.name}"
    )
  end

  it 'returns a full address (International, no zip code)' do
    @company = create(:company, state: nil, zip: nil)
    @presented_company = CompanyPresenter.new(@company)

    expect(@presented_company.full_address).to eq(
      "#{@company.line_one}<br />#{@company.line_two}<br />#{@company.city}, #{@company.country.name}"
    )
  end
end
