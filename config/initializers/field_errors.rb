require 'nokogiri'

ActionView::Base.field_error_proc =
  Proc.new do |html_tag, instance_tag|
    tag = Nokogiri::HTML.fragment(html_tag).children.first
    tag.add_class 'border-red border-2' if tag.name == 'input'
    tag.to_s.html_safe
  end
