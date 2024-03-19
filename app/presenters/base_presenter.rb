class BasePresenter < Pres::Presenter
  def find_time(seconds)
    hours = (seconds / (60 * 60)).floor
    minutes = ((seconds / 60) % 60).round
    [hours, minutes]
  end

  def draggable_type
    singular =
      ActiveSupport::Inflector.underscore(object.class.to_s.split('::').last)
    plural =
      ActiveSupport::Inflector
        .pluralize(object.class.model_name.human)
        .parameterize(separator: '_')
    "#{singular}|#{plural}"
  end
end
