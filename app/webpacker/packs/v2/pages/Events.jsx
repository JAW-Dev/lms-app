import React, { useEffect, useState } from 'react';
// Context
import useResponsive from '../hooks/useResponsive';
// Components
import { Main } from '../components/layouts/Layouts';
import Button from '../components/Button';

import { crmAPI } from '../api';
import getAllEvents from '../helpers/getAllEvents';

const EventCard = (data, key) => {
  let { title, imageUrl, excerpt, link, acf } = data.data;
  const {
    display_date,
    override_excerpt,
    override_image,
    override_link_url,
    override_title
  } = acf;

  title = override_title || title;
  link = override_link_url || link;
  imageUrl = override_image?.url || imageUrl;
  excerpt = override_excerpt || excerpt;

  const styles = {
    borderRadius: '32px',
    boxShadow: '0px 10px 50px rgba(0, 0, 0, .2)',
    maxWidth: '302px',
    width: '100%',
    backgroundColor: '#fdfdfe',
    borderWidth: '0',
    borderStyle: 'solid',
    borderColor: '#dfdfe0',
    overflow: 'hidden'
  };

  const imgWrapperStyles = {
    height: '180px',
    maxHeight: '180px',
    width: '100%',
    overflow: 'hidden',
    position: 'relative'
  };

  const imgStyles = {
    width: '302px',
    height: '180px',
    objectFit: 'cover',
    objectPosition: 'top center'
  };

  const buttonStyles = {
    borderRadius: '12px',
    marginRight: 'auto',
    fontSize: '14px'
  };

  const dateStyles = { padding: '6px 0', fontSize: '14px' };
  const excerptStyles = { fontSize: '12px' };

  return (
    <div key={key} className="flex flex-col" style={styles}>
      <div style={imgWrapperStyles}>
        <img src={imageUrl} alt={title} style={imgStyles} />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3>{title}</h3>
        <p style={dateStyles}>{display_date}</p>
        <div style={excerptStyles}>{excerpt}</div>
        <div className="pt-4 flex flex-col justify-end items-end flex-1 flex-wrap content-end">
          <Button
            type="button"
            variant="default-lowewrcase"
            className="font-bold capitalize"
            style={buttonStyles}
            href={link}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

const EventsSkeleton = () => {
  const blankCard = (
    <div
      style={{ height: '474px', width: '302px', borderRadius: '32px' }}
      className="loading-colors"
    />
  );

  const blankCards = Array.from({ length: 5 }, (_, i) => (
    <React.Fragment key={i}>{blankCard}</React.Fragment>
  ));

  return (
    <div className="flex flex-col">
      <div style={{ gap: '26px', marginBottom: '80px' }} className="flex">
        <div className="loading-colors h-4 w-36 rounded-md" />
        <div className="loading-colors h-4 w-36 rounded-md" />
      </div>
      <div
        style={{ marginBottom: '64px', width: '300px' }}
        className="loading-colors h-8  rounded-md"
      />
      <div style={{ gap: '24px' }} className="flex flex-wrap">
        {blankCards}
      </div>
    </div>
  );
};

const EventsContent = () => {
  const [allEvents, setAllEvents] = useState(null);
  const [acfOptions, setAcfOptions] = useState(null);
  const [status, setStatus] = useState('idle');
  const [acfStatus, setAcfStatus] = useState('idle');
  const { isMobile } = useResponsive();

  useEffect(() => {
    (async () => {
      setStatus('loading');
      setAcfStatus('loading');
      try {
        const allEventsData = await crmAPI.getAllEvents();
        const acfOptionsData = await crmAPI.getACFeaturedOptions();
        setAllEvents(allEventsData);
        setAcfOptions(acfOptionsData);
        setStatus('success');
        setAcfStatus('success');
      } catch {
        setStatus('error');
        setAcfStatus('error');
      }
    })();
  }, []);

  const isLoading = status === 'loading' || acfStatus === 'loading';
  const isError = status === 'error' || acfStatus === 'error';

  const events = getAllEvents(status, allEvents);
  const buttonClasses = 'capitalize font-bold underline';
  const buttonStyles = { fontSize: '14px' };
  const loadingColors = !acfOptions ? 'loading-colors' : '';

  return (
    <>
      <h1 className="font-extrabold  text-charcoal text-5xl">
        Events
      </h1>

      <div
        dangerouslySetInnerHTML={{ __html: acfOptions?.events_page_blurb }}
        style={{
          maxWidth: '870px',
          marginBottom: '24px',
          paddingTop: '12px',
          width: !acfOptions && '100%',
          height: !acfOptions && '240px'
        }}
        className={loadingColors}
      />

      {isLoading || isError || !allEvents ? (
        <EventsSkeleton />
      ) : (
        <>
          <div className="flex" style={{ gap: '26px', marginBottom: '80px' }}>
            {Object.keys(events).map((slug) => {
              const eventGroup = events[slug];
              const { tagSlug, tagName } = eventGroup;
              return (
                tagSlug && (
                  <Button
                    href={`#${tagSlug}`}
                    key={crypto.randomUUID()}
                    className={buttonClasses}
                    variant="purpleTextNormal"
                    style={buttonStyles}
                  >
                    {tagName} Events
                  </Button>
                )
              );
            })}
          </div>

          {Object.keys(events).map((slug) => {
            const eventGroup = events[slug];
            let { tagSlug, tagName, tagSubName } = eventGroup;
            let blurb = '';

            const meta = acfOptions[tagSlug];

            if (meta) {
              tagName = meta.leading_lable;
              tagSubName = meta.lable;
              blurb = meta.blurb;
            }

            return (
              <React.Fragment key={crypto.randomUUID()}>
                {tagSlug && (
                  <div
                    id={tagSlug}
                    key={crypto.randomUUID()}
                    style={{ marginBottom: '116px' }}
                  >
                    <h2
                      className="font-extrabold"
                      style={{
                        fontSize: '24px',
                        marginBottom: !blurb ? '32px' : '16px',
                        letterSpacing: '-1.2px'
                      }}
                    >
                      {tagName}{' '}
                      {tagSubName && (
                        <span className="font-normal">{tagSubName}</span>
                      )}
                    </h2>
                    {blurb && <p style={{ paddingBottom: '39px' }}>{blurb}</p>}
                    <div
                      className={`flex flex-wrap pt-8 ${
                        isMobile ? 'justify-center' : ''
                      }`}
                      style={{ gap: '24px' }}
                    >
                      {eventGroup.map((event) => (
                        <EventCard key={crypto.randomUUID()} data={event} />
                      ))}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </>
      )}
    </>
  );
};

const options = {
  content: <EventsContent />,
  layout: 'full',
  wrapperClasses: 'flex justify-center',
  innerStyle: { width: '100%', maxWidth: '1400px' }
};

const Events = () => <Main options={options} />;

export default Events;
