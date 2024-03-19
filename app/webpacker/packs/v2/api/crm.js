import { apiFetch } from './apiFetch';

export const getLatestFieldNote = async () => {
  const res = await fetch(
    'https://admiredleadership.com/wp-json/wp/v2/field_notes?&order_by=modified,date&order=desc&per_page=1'
  );
  if (res.ok) {
    const data = await res.json();
    return data[0];
  }
};
export const getACFeaturedOptions = async () => {
  const res = await fetch(
    'https://admiredleadership.com/wp-json/acf/v3/options/options'
  );

  if (res.ok) {
    const data = await res.json();
    const { acf } = data;
    return acf;
  }
};

export const getWebinars = () =>
  apiFetch({
    url: '/program/AL-Direct'
  });

export const getWebinarById = (webinarId) =>
  apiFetch({
    url: `/program/AL-Direct/${webinarId}`
  });

export const getBookSummaries = async () => {
  const res = await fetch(
    'https://admiredleadership.com/wp-json/wp/v2/book-summary'
  );

  if (res.ok) {
    return res.json();
  }

  const error = await res.json();
  throw new Error(error.message);
};

// ***********************************
export const getEvent = async () => {
  const featuredOptions = await getACFeaturedOptions(); // Fetch the featured options
  const featuredEventID = featuredOptions.featured_event_lms; // Get the featured event ID

  const res = await fetch(
    `https://admiredleadership.com/wp-json/wp/v2/events/${featuredEventID}`
  );

  if (res.ok) {
    const data = await res.json();
    return data || null;
  }

  return null;
};

export const getAllEvents = async () => {
  const res = await fetch(
    'https://admiredleadership.com/wp-json/lms/v1/events'
  );

  if (res.ok) {
    const eventData = await res.json();

    const currentDate = new Date().getTime();

    // Filter and sort events
    const filteredEvents = eventData.reduce((filtered, event) => {
      // Check if acf.publish_on_lms is not true, if so, return the current filtered array
      if (event.acf && event.acf.platform === 'marketing') {
        return filtered;
      }

      // Check if the event has a start_date and end_date
      if (event.acf.start_date && event.acf.end_date) {
        // If the end date is past the current date, return the current filtered array
        if (new Date(event.acf.end_date).getTime() < currentDate) {
          return filtered;
        }
      }

      // If the event only has a start date
      else if (event.acf.start_date) {
        // If the start date is past the current date, return the current filtered array
        if (new Date(event.acf.start_date).getTime() < currentDate) {
          return filtered;
        }
      }

      // If there are no start_date or end_date, the event will be included

      return [...filtered, event];
    }, []);

    const sortedEvents = filteredEvents.sort(
      (a, b) => {
        // Sort by start_date if it exists, else do not change the order
        if (a.acf.start_date && b.acf.start_date) {
          return new Date(a.acf.start_date).getTime() - new Date(b.acf.start_date).getTime();
        }
        return 0;
      }
    );

    return sortedEvents;
  }
};
