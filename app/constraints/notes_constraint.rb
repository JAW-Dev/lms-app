class NotesConstraint
  def matches?(request)
    Rails.configuration.features.dig(:notes)
  end
end
