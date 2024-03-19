import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Mousewheel, FreeMode } from 'swiper';
import Container from './Container';
import StarIcon from '../../../../assets/images/reskin-images/icon--star.svg';
import PlayButton from './PlayButton';
import useResponsive from '../hooks/useResponsive';
import { ContentContext } from '../context/ContentContext';
import Text from './Text';

SwiperCore.use([FreeMode]);

const BehaviorPlayCard = ({ behavior, currentModule }) => {
  const {
    player_uuid: vidyardPlayerId,
    title,
    video_length: videoLength
  } = behavior;

  const { setModule } = useContext(ContentContext);

  const moduleSetter = () => {
    setModule({
      module: currentModule,
      behavior
    });
  };

  return (
    <button
      type="button"
      onClick={() => moduleSetter()}
      className="behavior-card flex p-4 sm:p-8 bg-white behavior-play-card rounded-2lg sm:rounded-2xl flex-col md:flex-row cursor-pointer"
    >
      <div className="w-full md:w-1/2 flex flex-col items-start">
        <Text size="h2" variant="h2" className="mb-5 text-left">
          {title}
        </Text>
        {videoLength && (
          <h4 className=" text-sm lg:text-xl mb-8 md:mb-0">
            {Math.floor(videoLength / 60)}{' '}
            {videoLength > 60 ? 'minutes' : 'minute'}
          </h4>
        )}
      </div>
      <div className="relative rounded-2lg md:rounded-2xl w-full md:w-1/2 md:h-full">
        <img
          className="object-cover h-full w-full rounded-2lg md:rounded-2xl"
          src={`https://play.vidyard.com/${vidyardPlayerId}.jpg`}
          alt={title}
        />
        <PlayButton style={{ right: '-64px', top: '50%' }} />
      </div>
    </button>
  );
};

const BehaviorSwiper = ({ behaviors, currentModule }) => {
  const [swiper, setSwiper] = useState(null);
  const swiperParams = {
    modules: [Mousewheel],
    mousewheel: { forceToAxis: true },
    style: { overflowX: 'hidden', padding: '4rem 0' },
    spaceBetween: 67,
    slidesPerView: 'auto',
    freeMode: {
      enabled: true,
      sticky: false
    },
    scrollbar: { draggable: true },
    className: 'behavior-swiper',
    onSnapGridLengthChange: (curr) => {
      curr.snapGrid = [curr.snapGrid[0], (curr.slides.length - 1) * 573];
    },
    onSwiper: setSwiper
  };

  const { isMobile } = useResponsive();

  const [showAll, setShowAll] = useState(false);
  const [behaviorsToDisplay, setBehaviorsToDisplay] = useState(
    behaviors.slice(0, 3)
  );

  useEffect(() => {
    if (showAll) {
      setBehaviorsToDisplay(behaviors);
    } else {
      setBehaviorsToDisplay(behaviors.slice(0, 3));
    }
  }, [showAll]);

  useEffect(() => {
    if (swiper) {
      swiper.slideTo(0);
    }
  }, [currentModule]);

  return isMobile ? (
    <div style={{ gap: '36px' }} className="w-full flex flex-col mt-16">
      {behaviors &&
        behaviorsToDisplay.map((behavior) => (
          <BehaviorPlayCard
            key={behavior.id}
            behavior={behavior}
            currentModule={currentModule}
          />
        ))}
      <button
        className="mr-auto"
        type="button"
        onClick={() => setShowAll(!showAll)}
      >
        <Text variant="boldPurple" size="h6">{showAll ? 'SHOW LESS' : 'SEE ALL BEHAVIORS'}</Text>
      </button>
    </div>
  ) : (
    <Swiper {...swiperParams}>
      {behaviors &&
        behaviors.map((behavior) => (
          <SwiperSlide key={behavior.id}>
            <BehaviorPlayCard
              behavior={behavior}
              currentModule={currentModule}
            />
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

const ModuleNumberSlider = ({ courses, currentModule, setCurrentModule }) => {
  const swiperParams = {
    slidesPerView: 'auto',
    style: { padding: '2rem 0 2rem 2rem', marginLeft: '-2rem' },
    modules: [Mousewheel],
    freeMode: {
      enabled: true,
      sticky: false
    },
    mousewheel: { forceToAxis: true },
    onSnapGridLengthChange: (curr) => {
      curr.snapGrid = [curr.snapGrid[0], (curr.slides.length - 5) * 76];
    }
  };

  return (
    <div className="flex container flex-col  md:items-center md:flex-row">
      <h4 className="uppercase text-sm font-extrabold text-purple-500 mr-4">
        Modules
      </h4>
      <Swiper {...swiperParams}>
        {courses.map((course, index) => (
          <SwiperSlide key={course.id}>
            <ModuleNumber
              course={course}
              index={index}
              onClick={() => setCurrentModule({ index, course })}
              active={currentModule.course.id === course.id}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const ModuleNumber = ({ course, index, onClick, active }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ height: '64px', width: '64px' }}
    className={`${
      active && 'shadow-lg bg-white'
    } hover:shadow-lg hover:bg-white rounded-full flex items-center justify-center mr-3 outline-none transition`}
  >
    <div
      style={{ height: '42px', width: '42px' }}
      className="rounded-full flex items-center justify-center border-4 border-gray font-bold text-charcoal"
    >
      {course.options && course.options.icon === 'star' ? (
        <img src={StarIcon} alt="Foundational Star Icon=" />
      ) : (
        index
      )}
    </div>
  </button>
);

const ModuleText = ({ course: { title, description } }) => (
  <div className="module-text flex flex-col text-charcoal justify-center z-10 module-slider-gradient xl:w-1/2 xl:absolute">
    {title && (
    <Text size="h1" variant="h1">
      {title}
    </Text>
    )}
    {description && title === 'Foundations' && (
    <Text size="p-l" variant="p-l" className="mt-5">
      {description}
    </Text>
    )}
  </div>
);

const ModulesInDetail = ({ courses }) => {
  const [currentModule, setCurrentModule] = useState({
    index: 0,
    course: courses[0]
  });

  return (
    courses && (
      <Container borderBottom className="py-10 overflow-x-hidden">
        <ModuleNumberSlider
          courses={courses}
          currentModule={currentModule}
          setCurrentModule={setCurrentModule}
        />
        <div
          style={{ minHeight: '518px' }}
          className="relative w-full flex items-center container py-10 flex-col xl:flex-row"
        >
          <ModuleText course={currentModule.course} />
          <BehaviorSwiper
            currentModule={currentModule.course}
            behaviors={currentModule.course.behaviors}
          />
        </div>
      </Container>
    )
  );
};

export default ModulesInDetail;
