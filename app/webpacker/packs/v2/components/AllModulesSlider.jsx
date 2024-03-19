/* eslint-disable */

import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Grid, Scrollbar } from 'swiper';
import Container from './Container';
import PlayButton from './PlayButton';
import PurpleStarIcon from '../../../../assets/images/reskin-images/icon--star-purple.svg';

import Module0Img from '../../../../assets/images/reskin-images/img--module-0.png';
import Module1Img from '../../../../assets/images/reskin-images/img--module-1.png';
import Module2Img from '../../../../assets/images/reskin-images/img--module-2.png';
import Module3Img from '../../../../assets/images/reskin-images/img--module-3.png';
import Module4Img from '../../../../assets/images/reskin-images/img--module-4.png';
import Module5Img from '../../../../assets/images/reskin-images/img--module-5.png';
import Module6Img from '../../../../assets/images/reskin-images/img--module-6.png';
import Module7Img from '../../../../assets/images/reskin-images/img--module-7.png';
import Module8Img from '../../../../assets/images/reskin-images/img--module-8.png';
import Module9Img from '../../../../assets/images/reskin-images/img--module-9.png';
import Module10Img from '../../../../assets/images/reskin-images/img--module-10.png';
import useResponsive from '../hooks/useResponsive';
import { ContentContext } from '../context/ContentContext';
import Text from './Text';

const moduleImgs = [
  Module0Img,
  Module2Img,
  Module3Img,
  Module4Img,
  Module5Img,
  Module6Img,
  Module7Img,
  Module8Img,
  Module9Img,
  Module10Img,
];

const ModuleVideoCard = ({ course, index }) => {
  const { behaviors } = course;
  const behavior = behaviors && behaviors[0];
  const {
    title,
    description,
    position,
    sku,
    options: { icon },
  } = course;
  const descriptionFirstSentence = description
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
    .split('|')[0];

  const { setModule } = useContext(ContentContext);

  return (
    behavior &&
    course && (
      <div
        onClick={() => setModule({ module: course })}
        className="module-video-card flex flex-col cursor-pointer"
      >
        <div className="relative">
          <img
            className="object-cover h-full"
            style={{
              borderRadius: '16px',
            }}
            // src={`https://play.vidyard.com/${behavior.player_uuid}.jpg`}
            src={moduleImgs[index] || moduleImgs[index - 10]}
            alt={title}
          />
          <PlayButton
            className="module-video-card__button"
            style={{
              right: '-64px',
              top: '50%',
            }}
          />
        </div>
        <div className="flex flex-col mt-5">
          <Text size="h6" variant="boldPurple" className="mb-4">
            {icon === 'star' && (
              <img
                className="w-4 h-4 mr-2 mb-1"
                src={PurpleStarIcon}
                alt="Star Icon"
              />
            )}
            {sku === 'INTRO' ? sku : 'Module ' + (position - 1)}
          </Text>
          <button
            type="button"
            onClick={() => moduleSetter()}
            className="mb-5 text-left"
          >
            <Text size="h2" variant="h2">
              {title}
            </Text>
          </button>
          <Text size="p" variant="p">
            {descriptionFirstSentence}
          </Text>
        </div>
      </div>
    )
  );
};

const AllModulesSlider = ({ courses, isLoading }) => {
  const swiperParams = {
    modules: [Mousewheel, Grid, Scrollbar],
    mousewheel: { forceToAxis: true },
    style: { overflowX: 'hidden', padding: '4rem 0' },
    spaceBetween: 100,
    slidesPerView: 'auto',
    grid: { rows: 2, fill: 'row' },
    freeMode: {
      enabled: true,
      sticky: false,
    },
    scrollbar: { draggable: true },
    onSnapGridLengthChange: (curr) => {
      curr.snapGrid = [curr.snapGrid[0], (curr.slides.length / 2 - 1) * 532];
    },
  };

  const [showAll, setShowAll] = useState(false);
  const [coursesToDisplay, setCoursesToDisplay] = useState(
    courses.slice(0, 3) || []
  );

  useEffect(() => {
    if (showAll) {
      setCoursesToDisplay(courses);
    } else {
      setCoursesToDisplay(courses.slice(0, 3));
    }
  }, [showAll]);

  const { isMobile } = useResponsive();
  const loadContent = !isLoading && courses;

  return (
    <Container borderBottom containerize className="py-10">
      <Text size="h6" variant="boldPurple" className="mb-10">
        ALL MODULES
      </Text>
      {loadContent && isMobile ? (
        <div style={{ gap: '36px' }} className="w-full flex flex-col mt-16">
          {courses &&
            coursesToDisplay.map((course, index) => (
              <ModuleVideoCard index={index} course={course} />
            ))}
          <button
            className="mr-auto"
            type="button"
            onClick={() => setShowAll(!showAll)}
          >
            <Text size="h6" variant="boldPurple">
              {showAll ? 'SHOW LESS' : 'SEE ALL COURSES'}
            </Text>
          </button>
        </div>
      ) : loadContent && !isMobile ? (
        <Swiper {...swiperParams}>
          {courses.map((course, index) => {
            return (
              <SwiperSlide key={course.id}>
                <ModuleVideoCard index={index} course={course} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : undefined}
    </Container>
  );
};

export default AllModulesSlider;
