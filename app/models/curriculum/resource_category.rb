class Curriculum::ResourceCategory
  include HTTParty
  base_uri Rails.application.credentials[Rails.env.to_sym].dig(
             :wordpress,
             :api_url
           )

  attr_reader :name,
              :description,
              :full_description,
              :icon,
              :slug,
              :resource_count,
              :link
  attr_accessor :resources

  def initialize(name, description, full_description, icon, slug, count, link)
    @name = name
    @description = description
    @full_description = full_description
    @icon = icon
    @slug = slug
    @resource_count = count
    @link = link
    @resources = []
  end

  def self.all(opts = {})
    options = { format: :json }
    options.merge!(opts)

    begin
      resp = get('/wp-json/wp/v2/resource-categories', options)
      resp
        .reject { |item| item['count'].zero? }
        .map do |item|
          self.new(
            item['name'],
            item['description'],
            item['full_description'],
            item['icon'],
            item['slug'],
            item['count'],
            item['page_link']
          )
        end
    rescue StandardError
      []
    end
  end

  def self.find_by_slug(slug, opts = {})
    category = self.all.find { |category| category.slug == slug }

    options = { query: { 'filter[resource_category]' => slug }, format: :json }
    options.merge!(opts)
  end
end
