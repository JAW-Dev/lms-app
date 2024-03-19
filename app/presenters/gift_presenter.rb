class GiftPresenter < Pres::Presenter
  def status
    if object.expired?
      return(
        [
          "<span class='border-b border-dotted border-grey-darker cursor-help' title='Expired on #{l(object.updated_at + 48.hours)}'>Expired</span>"
        ]
      )
    end

    time_left =
      48 - TimeDifference.between(object.updated_at, DateTime.now).in_hours
    if object.pending?
      "<span class='border-b border-dotted border-grey-darker cursor-help' title='Expires on #{l(DateTime.now + time_left.hours)}'>Pending</span>"
    else
      'Redeemed'
    end
  end
end
