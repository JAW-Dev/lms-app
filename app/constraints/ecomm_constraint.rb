class EcommConstraint
  def matches?(request)
    Rails.configuration.features.dig(:ecomm)
  end
end
