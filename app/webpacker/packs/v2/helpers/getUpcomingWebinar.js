import { parseISO, isFuture } from 'date-fns';

const getUpcomingWebinar = (status, webinars) => {
  if (status === 'error' || status === 'loading') {
    return [];
  }

  if (status === 'success') {
    const filteredWebinars = webinars?.filter((webinar) => isFuture(parseISO(webinar.presented_at)));
    const sortedWebinars = filteredWebinars?.sort(
      (a, b) => parseISO(a.presented_at) - parseISO(b.presented_at)
    );
    return sortedWebinars?.[0];
  }

  return [];
};

export default getUpcomingWebinar;
