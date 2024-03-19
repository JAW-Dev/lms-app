require "#{Rails.root}/db/services/country_seed_service"

namespace :world do
	task add_countries: :environment do
		CountrySeedService.add_countries
	end

	task add_states: :environment do
		if Country.any?
			CountrySeedService.add_states
		else
			puts "Run rake countries:add_countries first"
		end
	end

  task :add_territories => :environment do
    State.create([
      {
      	name: "American Samoa",
      	abbr: "AS",
      	country: Country.find_by_alpha2('US')
      },
      {
      	name: "Guam",
      	abbr: "GU",
      	country: Country.find_by_alpha2('US')
      },
      {
      	name: "Northern Mariana Islands",
      	abbr: "MP",
      	country: Country.find_by_alpha2('US')
      },
      {
      	name: "Puerto Rico",
      	abbr: "PR",
      	country: Country.find_by_alpha2('US')
      },
      {
      	name: "United States Minor Outlying Islands",
      	abbr: "UM",
      	country: Country.find_by_alpha2('US')
      },
      {
      	name: "Virgin Islands",
      	abbr: "VI",
      	country: Country.find_by_alpha2('US')
      }
    ])
  end
end
