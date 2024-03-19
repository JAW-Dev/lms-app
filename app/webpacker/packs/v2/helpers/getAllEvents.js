const getAllEvents = (status, events) => {
  if (!events) {
    return [];
  }
  const singleDayEvents = [];
  const multiDayEvents = [];
  const virtualEvents = [];
  const allEvents = {};

  events.forEach((event) => {
    if (event.tags) {
      if (event.tags.some((tag) => tag.slug === 'in-person')) {
        if (event.tags.some((tag) => tag.slug === 'multi-day')) {
          multiDayEvents.push(event);
          multiDayEvents.tagSlug = 'multi-day';
          multiDayEvents.tagName = 'Multi-Day';
          multiDayEvents.tagSubName = 'In Person Events';
        }

        if (event.tags.some((tag) => tag.slug === 'single-day')) {
          singleDayEvents.push(event);
          singleDayEvents.tagSlug = 'single-day';
          singleDayEvents.tagName = 'Single Day';
          singleDayEvents.tagSubName = 'In Person Events';
        }
      } else if (event.tags.some((tag) => tag.slug === 'virtual')) {
        virtualEvents.push(event);
        virtualEvents.tagSlug = 'virtual';
        virtualEvents.tagName = event.tags.find((tag) => tag.slug === 'virtual').name;
        virtualEvents.tagSubName = 'Events';
      }
    }
  });

  allEvents.singleDay = singleDayEvents;
  allEvents.multiDay = multiDayEvents;
  allEvents.virtual = virtualEvents;

  return allEvents;
};

export default getAllEvents;
