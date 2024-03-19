module CountrySeedService
  def add_countries
    Country.create([
      {:name=>"Afghanistan", :alpha2=>"AF"},
      {:name=>"Albania", :alpha2=>"AL"},
      {:name=>"Algeria", :alpha2=>"DZ"},
      {:name=>"American Samoa", :alpha2=>"AS"},
      {:name=>"Andorra", :alpha2=>"AD"},
      {:name=>"Angola", :alpha2=>"AO"},
      {:name=>"Anguilla", :alpha2=>"AI"},
      {:name=>"Antarctica", :alpha2=>"AQ"},
      {:name=>"Antigua And Barbuda", :alpha2=>"AG"},
      {:name=>"Argentina", :alpha2=>"AR"},
      {:name=>"Armenia", :alpha2=>"AM"},
      {:name=>"Aruba", :alpha2=>"AW"},
      {:name=>"Australia", :alpha2=>"AU"},
      {:name=>"Austria", :alpha2=>"AT"},
      {:name=>"Azerbaijan", :alpha2=>"AZ"},
      {:name=>"Bahamas", :alpha2=>"BS"},
      {:name=>"Bahrain", :alpha2=>"BH"},
      {:name=>"Bangladesh", :alpha2=>"BD"},
      {:name=>"Barbados", :alpha2=>"BB"},
      {:name=>"Belarus", :alpha2=>"BY"},
      {:name=>"Belgium", :alpha2=>"BE"},
      {:name=>"Belize", :alpha2=>"BZ"},
      {:name=>"Benin", :alpha2=>"BJ"},
      {:name=>"Bermuda", :alpha2=>"BM"},
      {:name=>"Bhutan", :alpha2=>"BT"},
      {:name=>"Bolivia", :alpha2=>"BO"},
      {:name=>"Bosnia And Herzegovina", :alpha2=>"BA"},
      {:name=>"Botswana", :alpha2=>"BW"},
      {:name=>"Bouvet Island", :alpha2=>"BV"},
      {:name=>"Brazil", :alpha2=>"BR"},
      {:name=>"British Indian Ocean Territory", :alpha2=>"IO"},
      {:name=>"Brunei Darussalam", :alpha2=>"BN"},
      {:name=>"Bulgaria", :alpha2=>"BG"},
      {:name=>"Burkina Faso", :alpha2=>"BF"},
      {:name=>"Burundi", :alpha2=>"BI"},
      {:name=>"Cambodia", :alpha2=>"KH"},
      {:name=>"Cameroon", :alpha2=>"CM"},
      {:name=>"Canada", :alpha2=>"CA"},
      {:name=>"Cape Verde", :alpha2=>"CV"},
      {:name=>"Cayman Islands", :alpha2=>"KY"},
      {:name=>"Central African Republic", :alpha2=>"CF"},
      {:name=>"Chad", :alpha2=>"TD"},
      {:name=>"Chile", :alpha2=>"CL"},
      {:name=>"China", :alpha2=>"CN"},
      {:name=>"Christmas Island", :alpha2=>"CX"},
      {:name=>"Cocos Islands", :alpha2=>"CC"},
      {:name=>"Colombia", :alpha2=>"CO"},
      {:name=>"Comoros", :alpha2=>"KM"},
      {:name=>"Congo", :alpha2=>"CG"},
      {:name=>"Cook Islands", :alpha2=>"CK"},
      {:name=>"Costa Rica", :alpha2=>"CR"},
      {:name=>"Croatia", :alpha2=>"HR"},
      {:name=>"Cuba", :alpha2=>"CU"},
      {:name=>"Cyprus", :alpha2=>"CY"},
      {:name=>"Czech Republic", :alpha2=>"CZ"},
      {:name=>"Denmark", :alpha2=>"DK"},
      {:name=>"Djibouti", :alpha2=>"DJ"},
      {:name=>"Dominica", :alpha2=>"DM"},
      {:name=>"Dominican Republic", :alpha2=>"DO"},
      {:name=>"East Timor", :alpha2=>"TP"},
      {:name=>"Ecuador", :alpha2=>"EC"},
      {:name=>"Egypt", :alpha2=>"EG"},
      {:name=>"El Salvador", :alpha2=>"SV"},
      {:name=>"Equatorial Guinea", :alpha2=>"GQ"},
      {:name=>"Eritrea", :alpha2=>"ER"},
      {:name=>"Estonia", :alpha2=>"EE"},
      {:name=>"Ethiopia", :alpha2=>"ET"},
      {:name=>"Falkland Islands", :alpha2=>"FK"},
      {:name=>"Faroe Islands", :alpha2=>"FO"},
      {:name=>"Fiji", :alpha2=>"FJ"},
      {:name=>"Finland", :alpha2=>"FI"},
      {:name=>"France", :alpha2=>"FR"},
      {:name=>"French Guiana", :alpha2=>"GF"},
      {:name=>"French Polynesia", :alpha2=>"PF"},
      {:name=>"French Southern Territories", :alpha2=>"TF"},
      {:name=>"Gabon", :alpha2=>"GA"},
      {:name=>"Gambia", :alpha2=>"GM"},
      {:name=>"Georgia", :alpha2=>"GE"},
      {:name=>"Germany", :alpha2=>"DE"},
      {:name=>"Ghana", :alpha2=>"GH"},
      {:name=>"Gibraltar", :alpha2=>"GI"},
      {:name=>"Greece", :alpha2=>"GR"},
      {:name=>"Greenland", :alpha2=>"GL"},
      {:name=>"Grenada", :alpha2=>"GD"},
      {:name=>"Guadeloupe", :alpha2=>"GP"},
      {:name=>"Guam", :alpha2=>"GU"},
      {:name=>"Guatemala", :alpha2=>"GT"},
      {:name=>"Guinea", :alpha2=>"GN"},
      {:name=>"Guinea-Bissau", :alpha2=>"GW"},
      {:name=>"Guyana", :alpha2=>"GY"},
      {:name=>"Haiti", :alpha2=>"HT"},
      {:name=>"Heard Island And Mcdonald Islands", :alpha2=>"HM"},
      {:name=>"Honduras", :alpha2=>"HN"},
      {:name=>"Hong Kong", :alpha2=>"HK"},
      {:name=>"Hungary", :alpha2=>"HU"},
      {:name=>"Iceland", :alpha2=>"IS"},
      {:name=>"India", :alpha2=>"IN"},
      {:name=>"Indonesia", :alpha2=>"ID"},
      {:name=>"Iran", :alpha2=>"IR"},
      {:name=>"Iraq", :alpha2=>"IQ"},
      {:name=>"Ireland", :alpha2=>"IE"},
      {:name=>"Israel", :alpha2=>"IL"},
      {:name=>"Italy", :alpha2=>"IT"},
      {:name=>"Ivory Coast", :alpha2=>"CI"},
      {:name=>"Jamaica", :alpha2=>"JM"},
      {:name=>"Japan", :alpha2=>"JP"},
      {:name=>"Jordan", :alpha2=>"JO"},
      {:name=>"Kazakstan", :alpha2=>"KZ"},
      {:name=>"Kenya", :alpha2=>"KE"},
      {:name=>"Kiribati", :alpha2=>"KI"},
      {:name=>"Kosovo", :alpha2=>"KV"},
      {:name=>"Kuwait", :alpha2=>"KW"},
      {:name=>"Kyrgyzstan", :alpha2=>"KG"},
      {:name=>"Laos", :alpha2=>"LA"},
      {:name=>"Latvia", :alpha2=>"LV"},
      {:name=>"Lebanon", :alpha2=>"LB"},
      {:name=>"Lesotho", :alpha2=>"LS"},
      {:name=>"Liberia", :alpha2=>"LR"},
      {:name=>"Liechtenstein", :alpha2=>"LI"},
      {:name=>"Lithuania", :alpha2=>"LT"},
      {:name=>"Luxembourg", :alpha2=>"LU"},
      {:name=>"Macau", :alpha2=>"MO"},
      {:name=>"Macedonia", :alpha2=>"MK"},
      {:name=>"Madagascar", :alpha2=>"MG"},
      {:name=>"Malawi", :alpha2=>"MW"},
      {:name=>"Malaysia", :alpha2=>"MY"},
      {:name=>"Maldives", :alpha2=>"MV"},
      {:name=>"Mali", :alpha2=>"ML"},
      {:name=>"Malta", :alpha2=>"MT"},
      {:name=>"Marshall Islands", :alpha2=>"MH"},
      {:name=>"Martinique", :alpha2=>"MQ"},
      {:name=>"Mauritania", :alpha2=>"MR"},
      {:name=>"Mauritius", :alpha2=>"MU"},
      {:name=>"Mayotte", :alpha2=>"YT"},
      {:name=>"Mexico", :alpha2=>"MX"},
      {:name=>"Micronesia", :alpha2=>"FM"},
      {:name=>"Moldova", :alpha2=>"MD"},
      {:name=>"Monaco", :alpha2=>"MC"},
      {:name=>"Mongolia", :alpha2=>"MN"},
      {:name=>"Montenegro", :alpha2=>"ME"},
      {:name=>"Montserrat", :alpha2=>"MS"},
      {:name=>"Morocco", :alpha2=>"MA"},
      {:name=>"Mozambique", :alpha2=>"MZ"},
      {:name=>"Myanmar", :alpha2=>"MM"},
      {:name=>"Namibia", :alpha2=>"NA"},
      {:name=>"Nauru", :alpha2=>"NR"},
      {:name=>"Nepal", :alpha2=>"NP"},
      {:name=>"Netherlands", :alpha2=>"NL"},
      {:name=>"Netherlands Antilles", :alpha2=>"AN"},
      {:name=>"New Caledonia", :alpha2=>"NC"},
      {:name=>"New Zealand", :alpha2=>"NZ"},
      {:name=>"Nicaragua", :alpha2=>"NI"},
      {:name=>"Niger", :alpha2=>"NE"},
      {:name=>"Nigeria", :alpha2=>"NG"},
      {:name=>"Niue", :alpha2=>"NU"},
      {:name=>"Norfolk Island", :alpha2=>"NF"},
      {:name=>"Northern Mariana Islands", :alpha2=>"MP"},
      {:name=>"North Korea", :alpha2=>"KP"},
      {:name=>"Norway", :alpha2=>"NO"},
      {:name=>"Oman", :alpha2=>"OM"},
      {:name=>"Pakistan", :alpha2=>"PK"},
      {:name=>"Palau", :alpha2=>"PW"},
      {:name=>"Palestinian Territory", :alpha2=>"PS"},
      {:name=>"Panama", :alpha2=>"PA"},
      {:name=>"Papua New Guinea", :alpha2=>"PG"},
      {:name=>"Paraguay", :alpha2=>"PY"},
      {:name=>"Peru", :alpha2=>"PE"},
      {:name=>"Philippines", :alpha2=>"PH"},
      {:name=>"Pitcairn", :alpha2=>"PN"},
      {:name=>"Poland", :alpha2=>"PL"},
      {:name=>"Portugal", :alpha2=>"PT"},
      {:name=>"Puerto Rico", :alpha2=>"PR"},
      {:name=>"Qatar", :alpha2=>"QA"},
      {:name=>"Reunion", :alpha2=>"RE"},
      {:name=>"Romania", :alpha2=>"RO"},
      {:name=>"Russia", :alpha2=>"RU"},
      {:name=>"Rwanda", :alpha2=>"RW"},
      {:name=>"Saint Helena", :alpha2=>"SH"},
      {:name=>"Saint Kitts And Nevis", :alpha2=>"KN"},
      {:name=>"Saint Lucia", :alpha2=>"LC"},
      {:name=>"Saint Pierre And Miquelon", :alpha2=>"PM"},
      {:name=>"Saint Vincent And The Grenadines", :alpha2=>"VC"},
      {:name=>"Samoa", :alpha2=>"WS"},
      {:name=>"San Marino", :alpha2=>"SM"},
      {:name=>"Sao Tome And Principe", :alpha2=>"ST"},
      {:name=>"Saudi Arabia", :alpha2=>"SA"},
      {:name=>"Senegal", :alpha2=>"SN"},
      {:name=>"Serbia", :alpha2=>"RS"},
      {:name=>"Seychelles", :alpha2=>"SC"},
      {:name=>"Sierra Leone", :alpha2=>"SL"},
      {:name=>"Singapore", :alpha2=>"SG"},
      {:name=>"Slovakia", :alpha2=>"SK"},
      {:name=>"Slovenia", :alpha2=>"SI"},
      {:name=>"Solomon Islands", :alpha2=>"SB"},
      {:name=>"Somalia", :alpha2=>"SO"},
      {:name=>"South Africa", :alpha2=>"ZA"},
      {:name=>"South Georgia And The South Sandwich Islands", :alpha2=>"GS"},
      {:name=>"South Korea", :alpha2=>"KR"},
      {:name=>"Spain", :alpha2=>"ES"},
      {:name=>"Sri Lanka", :alpha2=>"LK"},
      {:name=>"Sudan", :alpha2=>"SD"},
      {:name=>"Suriname", :alpha2=>"SR"},
      {:name=>"Svalbard And Jan Mayen", :alpha2=>"SJ"},
      {:name=>"Swaziland", :alpha2=>"SZ"},
      {:name=>"Sweden", :alpha2=>"SE"},
      {:name=>"Switzerland", :alpha2=>"CH"},
      {:name=>"Syria", :alpha2=>"SY"},
      {:name=>"Taiwan", :alpha2=>"TW"},
      {:name=>"Tajikistan", :alpha2=>"TJ"},
      {:name=>"Tanzania", :alpha2=>"TZ"},
      {:name=>"Thailand", :alpha2=>"TH"},
      {:name=>"Togo", :alpha2=>"TG"},
      {:name=>"Tokelau", :alpha2=>"TK"},
      {:name=>"Tonga", :alpha2=>"TO"},
      {:name=>"Trinidad And Tobago", :alpha2=>"TT"},
      {:name=>"Tunisia", :alpha2=>"TN"},
      {:name=>"Turkey", :alpha2=>"TR"},
      {:name=>"Turkmenistan", :alpha2=>"TM"},
      {:name=>"Turks And Caicos Islands", :alpha2=>"TC"},
      {:name=>"Tuvalu", :alpha2=>"TV"},
      {:name=>"Uganda", :alpha2=>"UG"},
      {:name=>"Ukraine", :alpha2=>"UA"},
      {:name=>"United Arab Emirates", :alpha2=>"AE"},
      {:name=>"United Kingdom", :alpha2=>"GB"},
      {:name=>"United States", :alpha2=>"US"},
      {:name=>"United States Minor Outlying Islands", :alpha2=>"UM"},
      {:name=>"Uruguay", :alpha2=>"UY"},
      {:name=>"Uzbekistan", :alpha2=>"UZ"},
      {:name=>"Vanuatu", :alpha2=>"VU"},
      {:name=>"Venezuela", :alpha2=>"VE"},
      {:name=>"Vietnam", :alpha2=>"VN"},
      {:name=>"Virgin Islands, British", :alpha2=>"VG"},
      {:name=>"Virgin Islands, U.S.", :alpha2=>"VI"},
      {:name=>"Wallis And Futuna", :alpha2=>"WF"},
      {:name=>"Western Sahara", :alpha2=>"EH"},
      {:name=>"Yemen", :alpha2=>"YE"},
      {:name=>"Zambia", :alpha2=>"ZM"},
      {:name=>"Zimbabwe", :alpha2=>"ZW"}
    ])
  end

  def add_states
    State.create([
      {
        name: "Alabama",
        abbr: "AL",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Alaska",
        abbr: "AK",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Arizona",
        abbr: "AZ",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Arkansas",
        abbr: "AR",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "California",
        abbr: "CA",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Colorado",
        abbr: "CO",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Connecticut",
        abbr: "CT",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Delaware",
        abbr: "DE",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "District Of Columbia",
        abbr: "DC",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Florida",
        abbr: "FL",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Georgia",
        abbr: "GA",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Hawaii",
        abbr: "HI",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Idaho",
        abbr: "ID",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Illinois",
        abbr: "IL",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Indiana",
        abbr: "IN",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Iowa",
        abbr: "IA",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Kansas",
        abbr: "KS",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Kentucky",
        abbr: "KY",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Louisiana",
        abbr: "LA",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Maine",
        abbr: "ME",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Maryland",
        abbr: "MD",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Massachusetts",
        abbr: "MA",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Michigan",
        abbr: "MI",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Minnesota",
        abbr: "MN",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Mississippi",
        abbr: "MS",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Missouri",
        abbr: "MO",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Montana",
        abbr: "MT",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Nebraska",
        abbr: "NE",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Nevada",
        abbr: "NV",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "New Hampshire",
        abbr: "NH",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "New Jersey",
        abbr: "NJ",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "New Mexico",
        abbr: "NM",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "New York",
        abbr: "NY",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "North Carolina",
        abbr: "NC",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "North Dakota",
        abbr: "ND",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Ohio",
        abbr: "OH",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Oklahoma",
        abbr: "OK",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Oregon",
        abbr: "OR",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Pennsylvania",
        abbr: "PA",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Rhode Island",
        abbr: "RI",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "South Carolina",
        abbr: "SC",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "South Dakota",
        abbr: "SD",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Tennessee",
        abbr: "TN",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Texas",
        abbr: "TX",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Utah",
        abbr: "UT",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Vermont",
        abbr: "VT",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Virginia",
        abbr: "VA",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Washington",
        abbr: "WA",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "West Virginia",
        abbr: "WV",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Wisconsin",
        abbr: "WI",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Wyoming",
        abbr: "WY",
        country: Country.find_by_alpha2('US')
      },
      {
        name: "Alberta",
        abbr: "AB",
        country: Country.find_by_alpha2('CA')
      },
      {
        name: "British Columbia",
        abbr: "BC",
        country: Country.find_by_alpha2('CA')
      },
      {
        name: "Manitoba",
        abbr: "MB",
        country: Country.find_by_alpha2('CA')
      },
      {
        name: "New Brunswick",
        abbr: "NB",
        country: Country.find_by_alpha2('CA')
      },
      {
        name: "Newfoundland and Labrador",
        abbr: "NL",
        country: Country.find_by_alpha2('CA')
      },
      {
        name: "Nova Scotia",
        abbr: "NS",
        country: Country.find_by_alpha2('CA')
      },
      {
        name: "Ontario",
        abbr: "ON",
        country: Country.find_by_alpha2('CA')
      },
      {
        name: "Prince Edward Island",
        abbr: "PE",
        country: Country.find_by_alpha2('CA')
      },
      {
        name: "Quebec",
        abbr: "QC",
        country: Country.find_by_alpha2('CA')
      },
      {
        name: "Saskatchewan",
        abbr: "SK",
        country: Country.find_by_alpha2('CA')
      }
    ])
  end

  extend self
end
