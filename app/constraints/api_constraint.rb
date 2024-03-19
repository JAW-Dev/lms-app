class ApiConstraint
  def matches?(request)
    Rails.configuration.features.dig(:api)
  end
end
