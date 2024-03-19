json.extract! company,
              :id,
              :name,
              :line_one,
              :line_two,
              :city,
              :state,
              :zip,
              :phone,
              :created_at,
              :updated_at
json.url company_url(company, format: :json)
