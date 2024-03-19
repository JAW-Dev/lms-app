class Curriculum::BookSummary
  include HTTParty
  base_uri Rails.application.credentials[Rails.env.to_sym].dig(
             :wordpress,
             :api_url
           )

  attr_reader :title,
              :subtitle,
              :excerpt,
              :content,
              :slug,
              :author,
              :pdf_url,
              :featured_image,
              :stylesheets,
              :status,
              :date

  def initialize(item)
    @title = item['title']['rendered']
    @subtitle = item['subtitle']
    @excerpt = item['excerpt']['rendered']
    @content = item['content']['rendered']
    @slug = item['slug']
    @author = item['book_author']
    @pdf_url = item['pdf_download'] && item['pdf_download']['url']
    @featured_image = item['featured_image']
    @stylesheets = item['stylesheets']
    @status = item['status']
    @date =
      if item['date_gmt']
        DateTime
          .parse("#{item['date_gmt']}+0000")
          .in_time_zone('US/Eastern')
          .strftime('%Y-%m-%d %l:%M %p %Z')
      else
        nil
      end
  end

  def self.all(opts = {})
    options = { format: :json }
    options.deep_merge!(opts)

    begin
      resp = get('/wp-json/wp/v2/book-summary', options)
      pages = resp.headers['x-wp-totalpages'] ||= 1
      [resp.map { |item| self.new(item) }, pages.to_i]
    rescue StandardError
      [[], 1]
    end
  end

  def self.find_by_slug(slug, opts = {})
    options = { format: :json, query: { 'slug' => slug } }
    options.deep_merge!(opts)

    begin
      resp = get('/wp-json/wp/v2/book-summary', options)
      self.new(resp.first)
    rescue StandardError
    end
  end

  def status_icon
    case self.status
    when 'future'
      'far fa-clock'
    when 'draft'
      'far fa-edit'
    when 'private'
      'fas fa-lock'
    else
      nil
    end
  end

  def status_label
    case self.status
    when 'future'
      "Scheduled for #{self.date}"
    when 'draft'
      'Draft'
    when 'private'
      'Private'
    else
      nil
    end
  end
end
