class CompanyPresenter < Pres::Presenter
  def full_address(html: true)
    output = "#{object.line_one}"
    output << '<br />' if object.line_two.present? && html
    output << "#{object.line_two}" if object.line_two.present?
    output << (html ? '<br />' : ' ')
    output << "#{object.city}"
    output << ", #{object.state.abbr}" if object.state.present?
    output << " #{object.zip}" if object.zip.present?
    if object.state.nil? && object.country.present?
      output << ", #{object.country.name}"
    end
    output.html_safe
  end

  def short_address
    output = "#{object.city}"
    output << ", #{object.state.abbr}" if object.state.present?
    if object.state.nil? && object.country.present?
      output << ", #{object.country.name}"
    end
    output.html_safe
  end
end
