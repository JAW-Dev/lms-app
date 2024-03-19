class Curriculum::Event
  include HTTParty
  base_uri Rails.application.credentials[Rails.env.to_sym].dig(
             :wordpress,
             :api_url
           )

  attr_reader :title,
              :excerpt,
              :content,
              :image,
              :link_text,
              :link_url,
              :start_date,
              :end_date,
              :display_date,
              :form,
              :slug

  def initialize(
    title,
    excerpt,
    content,
    image,
    link_text,
    link_url,
    start_date,
    end_date,
    display_date,
    form,
    slug
  )
    @title = title
    @excerpt = excerpt
    @content = content
    @image = image
    @link_text = link_text.present? ? link_text : 'Learn More'
    @link_url = link_url
    @start_date =
      start_date.present? ? Date.strptime(start_date, '%Y-%m-%d') : nil
    @end_date = end_date.present? ? Date.strptime(end_date, '%Y-%m-%d') : nil
    @display_date = display_date
    @form = form
    @slug = slug
  end

  def date
    if @start_date && @end_date
      "#{@start_date.strftime('%b %e')} – #{@end_date.strftime('%b %e, %Y')}"
    elsif @start_date
      @start_date.strftime('%b %e, %Y')
    else
      "Dates for #{Date.today.year} have yet to be scheduled."
    end
  end

  def self.tag_id
    begin
      resp = get('/wp-json/wp/v2/event-tags?slug=lms')
      resp[0]['id']
    rescue StandardError
    end
  end

  def self.all(opts = {})
    options = { format: :json }
    options.merge!(opts)
    begin
      resp = get('/wp-json/wp/v2/event-tags?slug=lms')
      if tag_id = self.tag_id
        resp =
          get(
            "/wp-json/wp/v2/events?event-tags=#{tag_id}&orderby=menu_order&order=asc",
            options
          )
        resp.map do |item|
          self.new(
            item['title']['rendered'],
            item['uagb_excerpt'],
            item['event_details']['content'],
            item['uagb_featured_image_src']['large'][0],
            item['event_details']['link_text'],
            item['event_details']['link_url'],
            item['event_details']['start_date'],
            item['event_details']['end_date'],
            item['event_details']['display_date'],
            item['event_details']['form'],
            item['slug']
          )
        end
      else
        []
      end
    rescue StandardError
      []
    end
  end

  def self.find_by_slug(slug, opts = {})
    options = {
      format: :json,
      query: {
        'slug' => slug,
        'event-tags' => self.tag_id
      }
    }
    options.merge!(opts)

    begin
      resp = get('/wp-json/wp/v2/events', options)
      item = resp.first
      self.new(
        item['title']['rendered'],
        item['uagb_excerpt'],
        item['event_details']['content'],
        item['uagb_featured_image_src']['large'][0],
        item['event_details']['link_text'],
        item['event_details']['link_url'],
        item['event_details']['start_date'],
        item['event_details']['end_date'],
        item['event_details']['display_date'],
        item['event_details']['form'],
        item['slug']
      )
    rescue StandardError
    end
  end
end
