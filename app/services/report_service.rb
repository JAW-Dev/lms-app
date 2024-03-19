class ReportService
  include MoneyRails::ActionViewExtension
  include ActionView::Helpers::NumberHelper

  def initialize(start_date = (Date.today - 7.days), end_date = (Date.today))
    @start_date = start_date
    @end_date = end_date
    @client =
      Elasticsearch::Client.new(url: 'http://167.99.62.149:9200', log: false)
  end

  def build_query(controller, action, format, aggs, extras = [])
    query = {
      'query': {
        'bool': {
          'must': [
            { 'match': { 'controller.keyword': controller } },
            { 'match': { 'action': action } },
            { 'match': { 'format': format } }
          ]
        }
      },
      'aggs': aggs
    }

    query[:query][:bool][:must] += extras
    query
  end

  def sales
    extras = [{ 'match': { 'order.status': 'complete' } }]
    aggs = {
      'sales_over_time': {
        'date_range': {
          'field': '@timestamp',
          'ranges': [
            {
              'from': @start_date,
              'to': @end_date == Date.today ? 'now' : @end_date
            }
          ]
        },
        'aggs': {
          'by_day': {
            'date_histogram': {
              'field': '@timestamp',
              'interval': '1d',
              'format': 'dd MMM',
              'keyed': true
            },
            'aggs': {
              'sales': {
                'sum': {
                  'field': 'order.subtotal_cents'
                }
              }
            }
          }
        }
      }
    }

    query =
      build_query(
        'Curriculum::OrdersController',
        'update',
        'json',
        aggs,
        extras
      )
    result = @client.search(index: 'cra-analytics*', body: query)

    data =
      @start_date
        .upto(@end_date)
        .map do |date|
          begin
            result['aggregations']['sales_over_time']['buckets'][0]['by_day'][
              'buckets'
            ][
              date.to_s(:short)
            ][
              'sales'
            ][
              'value'
            ]
          rescue StandardError
            0
          end
        end

    {
      title: {
        text: humanized_money_with_symbol(Money.new(data.sum))
      },
      subtitle: {
        text: "Sales (Past #{(@end_date - @start_date).to_i} Days)"
      },
      labels:
        @start_date.upto(@end_date).map { |date| date.to_time.to_i * 1000 },
      series: [{ name: 'Sales', data: data }]
    }
  end

  def registrations
    aggs = {
      'registrations_over_time': {
        'date_range': {
          'field': '@timestamp',
          'ranges': [
            {
              'from': @start_date,
              'to': @end_date == Date.today ? 'now' : @end_date
            }
          ]
        },
        'aggs': {
          'by_day': {
            'date_histogram': {
              'field': '@timestamp',
              'interval': '1d',
              'format': 'dd MMM',
              'keyed': true
            }
          }
        }
      }
    }

    query = build_query('RegistrationsController', 'create', 'html', aggs)
    result = @client.search(index: 'cra-analytics*', body: query)

    data =
      @start_date
        .upto(@end_date)
        .map do |date|
          begin
            result['aggregations']['registrations_over_time']['buckets'][0][
              'by_day'
            ][
              'buckets'
            ][
              date.to_s(:short)
            ][
              'doc_count'
            ]
          rescue StandardError
            0
          end
        end

    {
      title: {
        text: data.sum
      },
      subtitle: {
        text: "Sign Ups (Past #{(@end_date - @start_date).to_i} Days)"
      },
      labels:
        @start_date.upto(@end_date).map { |date| date.to_time.to_i * 1000 },
      series: [{ name: 'Sign Ups', data: data }]
    }
  end

  def module_views
    aggs = {
      'module_views_over_time': {
        'date_range': {
          'field': '@timestamp',
          'ranges': [
            {
              'from': @start_date,
              'to': @end_date == Date.today ? 'now' : @end_date
            }
          ]
        },
        'aggs': {
          'by_day': {
            'date_histogram': {
              'field': '@timestamp',
              'interval': '1d',
              'format': 'dd MMM',
              'keyed': true
            }
          }
        }
      }
    }

    query = build_query('Curriculum::BehaviorsController', 'show', 'html', aggs)
    result = @client.search(index: 'cra-analytics*', body: query)

    data =
      @start_date
        .upto(@end_date)
        .map do |date|
          begin
            result['aggregations']['module_views_over_time']['buckets'][0][
              'by_day'
            ][
              'buckets'
            ][
              date.to_s(:short)
            ][
              'doc_count'
            ]
          rescue StandardError
            0
          end
        end

    {
      title: {
        text: data.sum
      },
      subtitle: {
        text: "Module Views (Past #{(@end_date - @start_date).to_i} Days)"
      },
      labels:
        @start_date.upto(@end_date).map { |date| date.to_time.to_i * 1000 },
      series: [{ name: 'Module Views', data: data }]
    }
  end

  def courses
    sales_aggs = {
      'sales_over_time': {
        'date_range': {
          'field': '@timestamp',
          'ranges': [
            {
              'from': @start_date,
              'to': @end_date == Date.today ? 'now' : @end_date
            }
          ]
        }
      }
    }

    module_views_aggs = {
      'module_views_over_time': {
        'date_range': {
          'field': '@timestamp',
          'ranges': [
            {
              'from': @start_date,
              'to': @end_date == Date.today ? 'now' : @end_date
            }
          ]
        }
      }
    }

    Curriculum::Course
      .enabled
      .order(position: :asc)
      .reduce([]) do |acc, course|
        users = User.with_role(:participant, course)
        completed =
          users.select do |user|
            Curriculum::CoursePresenter.new(course).progress_percent(user) ==
              '100%'
          end
        sales_extras = [
          { 'match': { 'order.status': 'complete' } },
          { 'match': { 'order.course_id': course.id } }
        ]
        sales_query =
          build_query(
            'Curriculum::OrdersController',
            'update',
            'json',
            sales_aggs,
            sales_extras
          )
        sales_result =
          @client.search(index: 'cra-analytics*', body: sales_query)

        begin
          sales =
            sales_result['aggregations']['sales_over_time']['buckets'][0][
              'doc_count'
            ]
        rescue StandardError
          sales = 0
        end

        module_views_extras = [{ 'match': { 'course_id': course.id } }]
        views_query =
          build_query(
            'Curriculum::BehaviorsController',
            'show',
            'html',
            module_views_aggs,
            module_views_extras
          )
        views_result =
          @client.search(index: 'cra-analytics*', body: views_query)

        begin
          views =
            views_result['aggregations']['module_views_over_time']['buckets'][
              0
            ][
              'doc_count'
            ]
        rescue StandardError
          views = 0
        end

        acc << {
          id: course.id,
          title: course.title,
          users: users.size,
          completed: completed.size,
          percent_complete:
            number_to_percentage(
              (completed.size / users.size.to_f) * 100,
              precision: 2
            ),
          sales: sales,
          views: views
        }
      end
  end
end
