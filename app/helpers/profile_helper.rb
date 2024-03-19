module ProfileHelper
  def hubspot_label(field)
    labels = {
      'access_type' => 'Access Type',
      'source' => 'Referral Access',
      'source_person' => 'Source Person',
      'profile_url' => 'View on HubSpot',
      'what_inspired_you_to_buy_admired_leadership_' =>
        'What inspired you to sign up?'
    }

    labels[field] || labels[field.to_s] || field.to_s.humanize.titlecase
  end
end
