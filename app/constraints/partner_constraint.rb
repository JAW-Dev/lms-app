class PartnerConstraint
  def matches?(request)
    partners = Rails.configuration.features.dig(:partners) || []
    partners.include?(request.params[:partner])
  end
end
