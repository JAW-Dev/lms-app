import React, { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import Container from './Container';
import { useMutation, useQueryClient } from 'react-query';
import { userAPI } from '../api';
import SVG from "react-inlinesvg";

import PodcastImg from '../../../../assets/images/reskin-images/img--podcasts.png';
import Text from './Text';
import useModal from '../context/ModalContext';
import useAuth from "../context/AuthContext";

import SmartPhone from '../../../../assets/images/reskin-images/icon--smartphone-2.svg';
import PodcastLinksModal from './PodcastLinksModal';

// const PodcastLinksModal = () => {
//   const { setContent } = useModal();
//   const { userData } = useAuth();
//   console.log(userData)
//   return (
//     <div className="flex flex-col items-center">
//       <div className="flex items-center p-4 bg-purple-100 rounded-full">
//         <SVG src={SmartPhone} />
//       </div>

//       <p className="pt-2 pb-8 text-center" style={{maxWidth: '440px'}}>Details regarding your private podcast links have been emailed to: <span className="text-link-purple">{userData.email}</span></p>
      
//       <button
//           type="button"
//           className="font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-2lg ml-auto"
//           onClick={() => setContent()}
//         >
//           OK
//         </button>
//     </div>
//   )
// }

const ListenToOurPodcast = () => {
  const { setContent } = useModal();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(userAPI.podcastCTA, {
    onSuccess: () => {}
  });

  const onClick = (e) => {
    e.preventDefault();
    setContent({
      modalTitle: 'Podcast Links',
      content: <PodcastLinksModal/>,
    });
    mutate();
  }

  return (
    <div className="listen-to-our-podcast flex relative overflow-hidden h-full p-8">
      <div className="flex flex-col items-star z-10 h-full w-full">
        <Text size="h6" variant="bold">
          PODCAST FEEDS
        </Text>

        <div className="w-full flex justify-center">
          <img
            src={PodcastImg}
            alt="Listen to our podcast."
            style={{ maxHeight: '340px', width: 'auto' }}
          />
        </div>

        <h4 className="mt-auto font-bold pb-2">
          Subscribers have special access to two key private podcast feeds:
        </h4>
        <ul className="mb-6 listen-to-our-podcast__list">
          <li>
            All Admired Leader Behavior modules
          </li>
          <li>
            All AL Direct Q&A sessions
          </li>
        </ul>

        <button
          onClick={onClick}
          style={{ borderRadius: '32px', width: 'fit-content' }}
          className="bg-link-purple text-white texdt-sm font-extrabold py-4 px-5  flex items-center justify-center uppercase mx-auto"
        >
          Get Your Links
        </button>
      </div>
    </div>
  );
}

const BookSummaryCard = ({ bookSummary }) => {
  const {
    uagb_featured_image_src: { medium },
    title: { rendered: title },
    subtitle,
    link
  } = bookSummary;

  return (
    <div className="book-summary-img p-6 flex flex-col items-start">
      <a href={link}>
        <img src={medium[0]} alt="Book" />
      </a>
      <a
        href={link}
        className="font-black font-sans text-sm text-charcoal mt-4 text-left"
      >
        {title}
      </a>
      <Text size="h6" variant="p" className="mb-6">
        {subtitle}
      </Text>
      <a
        href={link}
        className="font-black text-link-purple font-sans text-sm mt-auto"
      >
        <Text size="h6" variant="linkPurple">
          READ SUMMARY
        </Text>
      </a>
    </div>
  );
};

const BookSummaries = () => {
  const [excluded, setExcluded ] = useState(false);
  const [summariesCount, setSummariesCount ] = useState(3);
  const { data: bookSummaries } = useFetch(
    'https://admiredleadership.com/wp-json/wp/v2/book-summary'
  );

  const { userData } = useAuth();
  const excludes = [
    'Week Access',
    'N/A',
    'EXPIRED Full Access',
    '5 Free Videos',
    'EXPIRED Corporate Access',
    'EXPIRED Annual Access',
    'EXPIRED Ambassador Access',
    'EXPIRED Renewal',
    'EXPIRED Employee Access',
    '',
    '12 Hour Access'
  ];

  useEffect(() => {
    const accessType = userData?.profile?.hubspot?.access_type;

    if (excludes.includes(accessType)) {
      setExcluded(true);
      setSummariesCount(5);
    }
  }), [userData];

  return (
    <Container
      containerize
      style={{ gap: '24px' }}
      className="flex py-10 flex-col items-center xl:flex-row"
    >
      {!excluded && (
        <ListenToOurPodcast/>
      )}
      <div
        style={{
          boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.2)',
          borderRadius: '32px'
        }}
        className="bg-white p-8 w-full"
      >
        <div className="flex w-full items-center justify-between mb-2">
          <Text size="h6" variant="bold">
            BOOK SUMMARIES
          </Text>
          <a
            type="button"
            className="font-sans font-black text-link-purple"
            href="/program/book-summaries"
          >
            <Text size="h6" variant="linkPurple">
              SEE ALL
            </Text>
          </a>
        </div>
        <Text size="p" variant="p" className="mb-6">
          Read our summaries of leadership best reads.
        </Text>

        <div
          style={{ gap: '32px' }}
          className="flex flex-col md:flex-row"
        >
          {bookSummaries &&
            bookSummaries.map((bookSummary, index) => (
              index < summariesCount && (
              <BookSummaryCard
                key={crypto.randomUUID()}
                bookSummary={bookSummary}
              />
              )
            ))}
        </div>
      </div>
    </Container>
  );
};

export default BookSummaries;
