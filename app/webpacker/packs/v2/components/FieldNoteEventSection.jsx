import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Button from './Button';
import Container from './Container';
import { shortenContent } from '../helpers';
import Text from './Text';

import FieldNoteImg from '../../../../assets/images/reskin-images/img--field-notes.png';
import EventsImg from '../../../../assets/images/reskin-images/img--events.png';
import { crmAPI } from '../api';

const Content = ({ type, img, data, className }) => {
  const [cleanTitle, setCleanTitle] = useState('');
  useEffect(() => {
    if (data && data.title) {
      setCleanTitle(data.title.replace('\ufffc', ''));
    }
  }, [data]);

  const imageSource = data?.imgSrc ? data?.imgSrc : img;

  const loading = (
    <div
      className={`flex py-16 w-full flex-col md:flex-row xl:w-1/2 ${className}`}
    >
      <div
        style={{ height: '120px', width: '120px', minWidth: '120px' }}
        className="rounded-full bg-white mr-3 overflow-hidden hidden xl:block"
      >
        <div className="h-full w-full loading-colors" />
      </div>

      <div className="flex flex-col w-full">
        <span className="mb-3 h-8 w-full rounded loading-colors" />
        <span className="mb-5 h-8 w-3/4 rounded loading-colors" />
        <span className="mb-2 h-3 w-full rounded loading-colors" />
        <span className="mb-2 h-3 w-full rounded loading-colors" />
        <span className="mb-4 h-3 w-3/4 rounded loading-colors" />
      </div>
    </div>
  );

  return data ? (
    <div
      className={`flex py-10 xl:py-0 items-start w-full flex-col md:flex-row  xl:w-1/2  ${className}`}
    >
      <div
        style={{ height: '120px', width: '120px', minWidth: '120px' }}
        className="rounded-full bg-white shadow-circle-img mr-6 relative overflow-hidden block mb-6 md:mb-0"
      >
        {imageSource && (
          <img className="object-cover h-full" src={imageSource} alt="" />
        )}
      </div>

      <div className="flex items-start flex-col h-full">
        <Text size="h6" variant="bold" className="mb-2 xl:mb-3">
          {type}
        </Text>
        <a href={data.href}>
          <Text
            size="h3"
            variant="h3"
            dangerouslySetInnerHTML={{ __html: cleanTitle }}
            className="mb-3"
          />
        </a>
        <Text variant="p-l" className="mb-3 xl:mb-4">
          {data.paragraph}
        </Text>
        <div style={{ gap: '16px' }} className="flex mt-auto">
          <Button href={data.href}>Read More</Button>
          <Button variant="outline-transparent" href={data.archiveLink}>
            See All
          </Button>
        </div>
      </div>
    </div>
  ) : (
    loading
  );
};

const FieldNoteEventSection = () => {
  const [fieldNote, setFieldNote] = useState();
  const [event, setEvent] = useState();

  // const { data, isLoading } = useQuery(
  //   'acfFeaturedOptions',
  //   fetchACFeaturedOptions
  // );

  const { data: featuredEvent } = useQuery('eventData', crmAPI.getEvent);
  const { data: latestFieldNote } = useQuery(
    'latestFieldNote',
    crmAPI.getLatestFieldNote
  );

  const constructData = (dataSet, setData, archiveLink) => {
    if (!dataSet) return;

    const {
      type,
      excerpt: { rendered: content },
      title: { rendered: title },
      link: href,
      uagb_featured_image_src
    } = dataSet;

    const shortenedContent = shortenContent(content);

    setData({
      title,
      paragraph: shortenedContent,
      href,
      type,
      archiveLink,
      imgSrc: uagb_featured_image_src?.thumbnail[0]
    });
  };

  useEffect(() => {
    if (latestFieldNote) {
      constructData(
        latestFieldNote,
        setFieldNote,
        'https://admiredleadership.com/field-notes/'
      );
    }
    if (featuredEvent) {
      constructData(
        featuredEvent,
        setEvent,
        'https://admiredleadership.com/events/'
      );
    }
  }, [latestFieldNote, featuredEvent]);

  return (
    <Container
      containerize
      borderBottom
      className="py-10 xl:py-20"
      parentClassName="bg-purple-100"
    >
      <Text size="h1" variant="h1" className="mb-10 xl:mb-24">
        News & Events
      </Text>
      <div style={{ gap: '32px' }} className="flex flex-col xl:flex-row">
        <Content
          type="TODAY'S FIELD NOTE"
          img={FieldNoteImg}
          data={fieldNote}
        />
        <Content type="UPCOMING EVENTS" img={EventsImg} data={event} />
      </div>
    </Container>
  );
};

export default FieldNoteEventSection;
