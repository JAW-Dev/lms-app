import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Scrollbar } from 'swiper';
import useResponsive from '../hooks/useResponsive';

import Container from './Container';
import Text from './Text';

import ALDImg from '../../../../assets/images/reskin-images/img--ald-direct.png';
import StudyGroupImg from '../../../../assets/images/reskin-images/img--study-groups.png';
import CohortsImg from '../../../../assets/images/reskin-images/img--upcoming-cohorts.jpeg';
import BespokeImg from '../../../../assets/images/reskin-images/img--bespoke-solutions.jpeg';

const StayInTheKnowCard = ({ item }) => {
  const { text, img, path, content, imgPosition } = item;
  return (
    <div className="stay-in-the-know-card flex p-8 bg-white flex-col md:flex-row">
      <div className="mr-6 text-charcoal font-sans ">
        <a href={path}>
          <Text className="mb-4" size="h3" variant="h3">
            {text}
          </Text>
        </a>
        <div className=" text-sm mb-5">{content}</div>
        <a href={path} className="text-link-purple font-black">
          <Text size="h6" vairant="linkPurple">
            LEARN MORE
          </Text>
        </a>
      </div>
      <div className="stay-in-the-know-car__img mt-8 md:mt-0 w-full md:auto md:h-full md:ml-auto">
        <a href={path}>
          <img
            style={{ borderRadius: '16px', objectPosition: imgPosition }}
            className="object-cover w-full md:w-auto md:h-full"
            src={img}
            alt=""
          />
        </a>
      </div>
    </div>
  );
};

const StayInTheKnowText = () => (
  <div
    style={{ minWidth: '300px' }}
    className="flex flex-col h-full w-full text-charcoal z-10 w-full module-slider-gradient py-12 "
  >
    <div className="flex flex-col">
      <Text size="h1" variant="h1" className="leading-none -mb-1">
        Get Connected
      </Text>
    </div>
  </div>
);

const StayInTheKnowSwiper = () => {
  const swiperParams = {
    style: { padding: '2rem 25vw 4rem 25vw', margin: '0 -25vw' },
    className: 'stay-in-the-know-swiper',
    modules: [Mousewheel, Scrollbar],
    mousewheel: { forceToAxis: true },
    spaceBetween: 24,
    slidesPerView: 'auto',
    scrollbar: { draggable: true },
    freeMode: {
      enabled: true,
      sticky: false,
      freeModeMomentum: true,
      freeModeMomentumRatio: 1
    },
    onSnapGridLengthChange: (curr) => {
      curr.snapGrid = [curr.snapGrid[0], (curr.slides.length - 1) * 383];
    }
  };

  const { isMobile } = useResponsive();

  const stayInTheKnow = [
    {
      path: '/program/resources/study-groups',
      text: 'Community Discussion Groups',
      img: StudyGroupImg,
      content:
        'The best leaders know that personal transformation happens in conversation and dialogue. Our discussion groups are for those who are serious about this kind of growth. Groups meet online once a month. An Admired Leadership coach facilitates. A number of days and times are available.'
    },
    {
      path: '/program/AL-Direct',
      text: 'AL Direct',
      img: ALDImg,
      content:
        'AL Direct is our live-format podcast where you can post questions about Admired Leader behaviors, and share tough challenges you may be facing. The subscriber-only live sessions normally take place every third Tuesday. The recordings are available on this site and in a private podcast feed. Once each quarter this event is “unlocked” for non-subscriber participation.'
    },
    // {
    //   path: '/program/events',
    //   text: 'Upcoming Cohorts',
    //   img: CohortsImg,
    //   content:
    //     'While you can learn to master Admired Leadership Behaviors in a self-directed manner, we are expanding opportunities to join specific cohorts that will work through content modules and other special-focus challenges in groups that meet online.',
    //   imgPosition: '22% center'
    // },
    {
      path: '/contact-us',
      text: 'Bespoke Solutions',
      img: BespokeImg,
      content: (
        <div className="">
          <p className="mb-2">
            Beyond our digital platform and community, Admired Leadership always
            offers more personal and custom opportunities.
          </p>
          <ul>
            <li>Private Coaching</li>
            <li>Special Keynotes</li>
            <li>Team Dialogues</li>
            <li>Conference Options</li>
          </ul>
        </div>
      ),
      imgPosition: '37% center'
    }
  ];

  return isMobile ? (
    <div style={{ gap: '24px' }} className="flex flex-col mt-8">
      {stayInTheKnow.map((item) => <StayInTheKnowCard key={crypto.randomUUID()} item={item} />)}
    </div>
  ) : (
    <Swiper {...swiperParams}>
      {stayInTheKnow.map((item) => (
        <SwiperSlide key={crypto.randomUUID()}>
          <StayInTheKnowCard item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const StayInTheKnow = () => (
  <Container borderBottom containerize className="py-10">
    <Text variant="bold" size="h6" className="uppercase">
      Community & Conversation
    </Text>
    <div className="stay-in-the-know-content relative w-full flex md:container flex-col">
      <StayInTheKnowText />
      <StayInTheKnowSwiper />
    </div>
  </Container>
);

export default StayInTheKnow;
