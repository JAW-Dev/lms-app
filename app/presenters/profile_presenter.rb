class ProfilePresenter < Pres::Presenter
  delegate :first_name_was, :last_name_was, to: :object

  def full_name
    name =
      "#{object.first_name_was} #{object.last_name_was}".strip.gsub(/\s+/, ' ')
    name.present? ? name : object.user.email
  end

  def initials
    "#{object&.first_name_was&.chr}#{object&.last_name_was&.chr}"
  end
end
