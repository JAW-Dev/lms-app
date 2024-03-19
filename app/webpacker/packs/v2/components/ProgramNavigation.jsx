import React, { useContext, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion/dist/framer-motion';
import SVG from 'react-inlinesvg';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import useData from '../context/DataContext';
import Text from './Text';
import LinearProgressBar from './LinearProgressBar';
import useResponsive from '../hooks/useResponsive';

import IconChevronLeft from '../../../../assets/images/reskin-images/icon--chevron-left';
import IconChevronRight from '../../../../assets/images/reskin-images/icon--chevron-right';
import IconPlayButton from '../../../../assets/images/reskin-images/icon--play-v2-sm';
import IconStar from '../../../../assets/images/reskin-images/icon--star';
import IconLock from '../../../../assets/images/reskin-images/icon--lock';
import LogoBlackSm from '../../../../assets/images/reskin-images/logo--black-small.svg';
import IconChevronDown from '../../../../assets/images/reskin-images/icon--chevron-down.svg';
import { useSlideContent } from '../context/SlideContent';

const NavigationSizeSetButton = ({ navigationSize, setNavigationSize }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const decrement = () => {
    if (searchParams.get('moduleView')) {
      searchParams.delete('moduleView');
      setSearchParams(searchParams);
    }
    setNavigationSize((prev) => {
      if (prev !== 0) {
        return prev - 1;
      }
      return prev;
    });
  };

  const increment = () => {
    setNavigationSize((prev) => {
      if (prev !== 2) {
        return prev + 1;
      }
      return prev;
    });
  };

  return (
    <div
      className={`hidden lg:flex bg-white absolute items-center navigation-size-set-button navigation-size-set-button--${navigationSize}`}
    >
      {navigationSize === 1 ? (
        <>
          <button className="" type="button" onClick={() => decrement()}>
            <SVG src={IconChevronLeft} alt="Minimize " />
          </button>
          <span
            className={`bg-faint-charcoal ${navigationSize !== 1 && 'hidden'}`}
          />
          <button className="" type="button" onClick={() => increment()}>
            <SVG src={IconChevronRight} alt="Minimize " />
          </button>
        </>
      ) : (
        <button
          className="h-12 w-12 flex items-center justify-center"
          type="button"
          onClick={() => (navigationSize === 2 ? decrement() : increment())}
        >
          <SVG
            src={navigationSize === 2 ? IconChevronLeft : IconChevronRight}
            alt="Minimize "
          />
        </button>
      )}
    </div>
  );
};

export const ModuleCircle = ({
  module,
  position,
  isModuleView,
  navigationSize,
  setNavigationSize,
  focusedModule,
  setFocusedModule,
  hoveredModule,
  setHoveredModule,
  className,
  style,
  current,
  diameter: propDiameter,
  setHoveredModuleTitleWidth,
}) => {
  const completedCount = module.behaviors.reduce(
    (acc, behavior) => (behavior.completed ? acc + 1 : acc),
    0
  );

  const diameter = propDiameter || 40;
  const strokeWidth = 4;
  const radius = (diameter - strokeWidth) / 2;
  const ratio = completedCount / module.behaviors.length;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ratio * circumference;

  const { moduleId } = useParams();
  const isCurrentModule = moduleId === module.id.toString();
  const currentlyFocused = current || focusedModule?.id === module.id;

  const titleContainer = useRef();

  const titleWidth = titleContainer?.current?.clientWidth;

  const [expandTitle, setExpandTitle] = useState(false);

  const onMouseEnter = () => {
    setHoveredModule(module.id);
    if (navigationSize === 0) {
      setExpandTitle(true);
      setHoveredModuleTitleWidth(true);
      return;
    }
    if (navigationSize === 1) {
      if (isModuleView && !focusedModule) return;
      setExpandTitle(true);
    }
  };

  const onMouseLeave = () => {
    setHoveredModule();
    setExpandTitle(false);
    setHoveredModuleTitleWidth(false);
  };

  const onClick = () => {
    if (!module.enrolled_in) return;
    setFocusedModule(module);
    if (navigationSize === 0) {
      setNavigationSize(1);
    }
  };

  return (
    <button
      style={style}
      onClick={() => onClick()}
      type="button"
      className={`progress-circle progress-circle--${
        propDiameter && 'mini'
      } flex items-center justify-center rounded-full relative z-50 ${className}`}
      onMouseEnter={() => {
        onMouseEnter();
      }}
      onMouseLeave={() => onMouseLeave()}
    >
      <div
        className={`progress-circle progress-circle--${
          propDiameter && 'mini'
        } flex items-center justify-center rounded-full border-2 z-50 ${
          currentlyFocused ? 'bg-charcoal border-charcoal' : 'bg-white'
        } ${
          hoveredModule === module.id ? 'border-purple-500' : 'border-white'
        }`}
      >
        <svg
          className={`progress-circle-inner z-50 ${
            currentlyFocused ? 'bg-charcoal' : 'bg-white'
          }`}
          width={diameter}
          height={diameter}
        >
          {module.enrolled_in && (
            <>
              <circle
                cx={diameter / 2}
                cy={diameter / 2}
                r={radius}
                strokeWidth={strokeWidth}
                stroke="lightgray"
                fill="none"
              />
              <circle
                cx={diameter / 2}
                cy={diameter / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                stroke="#A7C400"
                fill="none"
                transform={`rotate(-90 ${diameter / 2} ${diameter / 2})`}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </>
          )}

          <foreignObject x="0" y="0" width={diameter} height={diameter}>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {(position === 0 || position === 1) && module.enrolled_in && (
                <SVG
                  className={`star-icon star-icon--${
                    currentlyFocused && 'current'
                  }`}
                  src={IconStar}
                />
              )}
              {module.title === 'Additional Behaviors' && (
                <SVG
                  className={`al-black-icon al-black-icon--${
                    currentlyFocused && 'current'
                  }`}
                  src={LogoBlackSm}
                  alt="Admired Leadership black small logo"
                />
              )}
              {position !== 0 &&
                position !== 1 &&
                module.title !== 'Additional Behaviors' &&
                module.enrolled_in && (
                  <span
                    className={`progress-circle-text font-semibold text-sm lg:text-base ${
                      currentlyFocused ? 'text-white' : 'text-charcoal'
                    }`}
                  >
                    {position && position - 1}
                  </span>
                )}

              {!module.enrolled_in && <SVG src={IconLock} />}
            </div>
          </foreignObject>
        </svg>
      </div>
      <div
        className="bg-charcoal absolute progress-circle__title flex items-center"
        style={{ width: expandTitle ? `${titleWidth}px` : '0' }}
      >
        <div
          ref={titleContainer}
          className="progress-circle__title__wrapper pl-12 py-2 pr-8 flex items-center"
        >
          <p className="text-white font-bold text-sm">{module.title}</p>
        </div>
      </div>
    </button>
  );
};

const ModuleCircleList = ({
  contentData,
  isModuleView,
  navigationSize,
  setNavigationSize,
  focusedModule,
  setFocusedModule,
  hoveredModule,
  setHoveredModule,
  setHoveredModuleTitleWidth,
}) => {
  return (
    <div style={{ minWidth: '64px' }} className="flex flex-col items-start">
      {navigationSize !== 2 &&
        contentData?.modules.map((module, index) => {
          return (
            <div
              className="flex flex-col items-center"
              key={crypto.randomUUID()}
            >
              <ModuleCircle
                position={index}
                module={module}
                isModuleView={isModuleView}
                navigationSize={navigationSize}
                setNavigationSize={setNavigationSize}
                focusedModule={focusedModule}
                setFocusedModule={setFocusedModule}
                hoveredModule={hoveredModule}
                setHoveredModule={setHoveredModule}
                setHoveredModuleTitleWidth={setHoveredModuleTitleWidth}
              />
              {index + 1 !== contentData.modules.length && (
                // DASHED LINE
                <motion.span
                  style={{
                    height:
                      navigationSize === 1 && isModuleView && !focusedModule
                        ? '167px'
                        : '20px',
                    transition: 'height 0.3s ease-in',
                  }}
                  // variants={{
                  //   expand: { height: '137px' },
                  //   shrink: { height: '20px' },
                  // }}
                  // animate={
                  //   navigationSize === 1 && isModuleView && !focusedModule
                  //     ? 'expand'
                  //     : 'shrink'
                  // }
                  className="dashed-line my-4"
                />
              )}
            </div>
          );
        })}
    </div>
  );
};

const ModuleCardsList = ({
  navigationSize,
  isModuleView,
  contentData,
  focusedModule,
  setFocusedModule,
  hoveredModule,
  setHoveredModule,
}) => {
  return (
    <motion.div
      variants={{
        initial: { y: '15px', opacity: '0' },
        show: { y: '0px', opacity: '1', transition: { delay: 0.3 } },
        hide: { display: 'none' },
        exit: { y: '15px', opacity: '0' },
      }}
      initial="initial"
      exit="exit"
      animate={navigationSize !== 0 && isModuleView ? 'show' : 'hide'}
      className={`module-cards flex flex-col ml-10 module-cards--${
        navigationSize === 2 && 'full-view'
      }`}
    >
      {contentData?.modules.map((module, index) => {
        return (
          <div key={crypto.randomUUID()} className="">
            {navigationSize === 2 && (
              <ModuleCircle
                module={module}
                position={index}
                isModuleView={true}
                navigationSize={navigationSize}
                focusedModule={focusedModule}
                setFocusedModule={setFocusedModule}
                hoveredModule={hoveredModule}
                setHoveredModule={setHoveredModule}
                className="mb-3"
              />
            )}
            <motion.button
              type="button"
              onClick={() => {
                if (!module.enrolled_in) return;
                setFocusedModule(module);
              }}
              key={crypto.randomUUID()}
              className={`module-card flex-auto flex flex-col p-5 w-full  items-start border-2 ${
                hoveredModule === module.id
                  ? 'border-purple-500'
                  : 'border-transparent'
              }`}
              onMouseEnter={() => setHoveredModule(module.id)}
              onMouseLeave={() => setHoveredModule()}
              style={
                hoveredModule === module.id && {
                  background:
                    'linear-gradient(0deg, rgba(139, 127, 219, 0.1), rgba(139, 127, 219, 0.1)), #FFFFFF',
                }
              }
            >
              <h4 className="font-bold text-xl mb-2 text-left">
                {module.title}
              </h4>
              <Text
                size="h6"
                varaint="p-l"
                className="truncated-text text-left mb-4"
              >
                {module.description}
              </Text>

              <div className="mt-auto text-link-purple font-bold uppercase">
                {module.title === 'Foundations'
                  ? 'View Foundational Principles'
                  : module.title === 'Making The Most of Admired Leadership'
                  ? 'View Video'
                  : 'View Behaviors'}
              </div>
            </motion.button>
          </div>
        );
      })}
    </motion.div>
  );
};

const BehaviorVideoDisplayList = ({
  navigationSize,
  setNavigationSize,
  behaviors,
  focusedModuleId,
}) => {
  const { behaviorId: behaviorIdParams } = useParams();
  return (
    <div
      className={`behavior-video-display-list behavior-video-display-list--${
        navigationSize === 2 && 'full-size'
      } flex flex-col py-16`}
    >
      {behaviors.map((behavior, index) => {
        const {
          id,
          title,
          player_uuid: playerUUID,
          video_length: videoLength,
        } = behavior;

        const isCurrentBehavior = behaviorIdParams === id.toString();
        return (
          <Link
            key={crypto.randomUUID()}
            to={`/v2/program/${focusedModuleId}/${id}`}
            onClick={() => navigationSize === 2 && setNavigationSize(1)}
          >
            <div
              className={`thumbnail-container overflow-hidden relative rounded-xl ${
                isCurrentBehavior && 'border-4 border-purple-500'
              }`}
            >
              <img
                className="object-cover w-full"
                src={`https://play.vidyard.com/${playerUUID}.jpg`}
                alt={`${title} thumbnail`}
              />
              <div className="play-button-svg absolute z-10 flex items-center justify-center">
                <div className="relative h-full w-full flex items-center justify-center">
                  <div className=" absolute bg-white h-full w-full rounded-full opacity-50" />
                  <SVG src={IconPlayButton} alt="Play Button" />
                </div>
              </div>

              <div
                className={`behavior-count font-bold flex items-center justify-center absolute rounded-full ${
                  isCurrentBehavior
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-charcoal'
                }`}
              >
                {title === 'This Is the Leader I Want to Be' && index === 0 ? (
                  <SVG src={IconStar} />
                ) : focusedModuleId === 2 ? (
                  index
                ) : (
                  index + 1
                )}
              </div>
            </div>
            <h5 className="text-charcoal text-xl font-bold mt-4 mb-2 leading-none">
              {title}
            </h5>
            <p className="font-bold text-charcoal text-xs">
              {Math.floor(videoLength / 60)}{' '}
              {videoLength > 60 ? 'minutes' : 'minute'}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

const BehaviorInDetail = ({
  focusedModule,
  navigationSize,
  setNavigationSize,
}) => {
  const { title, description, behaviors, id } = focusedModule;
  return (
    <motion.div
      className={`flex-auto behavior-in-detail behavior-in-detail--${
        navigationSize === 2 && 'full-size'
      }  px-10`}
      variants={{
        initial: { y: '15px', opacity: '0' },
        show: { y: '0px', opacity: '1' },
        hide: { display: 'none' },
      }}
      initial="initial"
      animate={navigationSize === 0 ? 'hide' : 'show'}
    >
      <div className="behavior-detail__top pb-8 border-b border-gray-dark">
        <div className="flex">
          {navigationSize === 2 && (
            <ModuleCircle
              style={{ height: 'fit-content' }}
              className="-mt-2 mr-4"
              module={focusedModule}
              current={true}
              position={focusedModule.position - 1}
            />
          )}
          <h1 className="font-black text-6xl text-charcoal mb-2 leading-none">
            {title}
          </h1>
        </div>
        <p className="text-sm text-charcoal mb-5">{description}</p>
        <LinearProgressBar module={focusedModule} />
      </div>
      <BehaviorVideoDisplayList
        navigationSize={navigationSize}
        setNavigationSize={setNavigationSize}
        focusedModuleId={id}
        behaviors={behaviors}
      />
    </motion.div>
  );
};

const MobileNavigationItem = ({
  expanded,
  setExpanded,
  module,
  position,
  setSlideContent,
}) => {
  const { title, description, id, behaviors } = module;

  const isOpen = expanded === id;

  const content = useRef(null);
  const [height, setHeight] = useState('0px');

  useEffect(() => {
    setHeight(isOpen ? `${content.current.scrollHeight}px` : '0px');
  }, [isOpen]);

  return (
    <div className="flex flex-col p-4">
      {/* Collapsed */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => {
            setExpanded(id);
          }}
          style={{ zIndex: 10 }}
          className="flex items-start"
        >
          <ModuleCircle
            style={{ height: 'fit-content' }}
            module={module}
            position={position}
          />
          <div
            style={{ minHeight: '132px' }}
            className="flex flex-col ml-6 items-start"
          >
            <h3 className="text-xl font-bold text-charcoal mb-2 text-left">
              {title}
            </h3>
            <p className="truncated-text text-charcoal text-sm mb-3 text-left">
              {description}
            </p>
            <div className="mt-auto text-link-purple font-bold uppercase">
              View Behaviors
            </div>
          </div>
          <div className="ml-auto">
            <SVG src={IconChevronDown} />
          </div>
        </button>
      ) : (
        <button
          onClick={() => {
            setExpanded();
          }}
          type="button"
          style={{ zIndex: 10 }}
          className="flex items-center"
        >
          <ModuleCircle
            style={{ height: 'fit-content' }}
            module={module}
            position={position}
            current={true}
          />
          <h3 className="text-xl font-bold text-charcoal ml-6 text-left">
            {title}
          </h3>
          <div className="ml-auto">
            <SVG
              style={{ transform: 'rotate(180deg)' }}
              src={IconChevronDown}
            />
          </div>
        </button>
      )}

      {/* Expanded Content */}

      <section
        className="accordion__content"
        ref={content}
        style={{ zIndex: 1, maxHeight: height }}
      >
        <div className="px-4 py-6">
          <p className="text-charcoal text-sm mb-3 mb-5">{description}</p>
          <LinearProgressBar module={module} />
          <h5 className="text-charcoal font-black text-sm mt-8 mb-5">
            BEHAVIORS
          </h5>
          <div
            style={{ gap: '32px' }}
            className="mobile-behaviors-list flex flex-wrap"
          >
            {behaviors.map((behavior) => {
              const {
                title: behaviorTitle,
                id: behaviorID,
                player_uuid: playerUUID,
                video_length: videoLength,
              } = behavior;
              return (
                <Link
                  key={crypto.randomUUID()}
                  to={`/v2/program/${id}/${behaviorID}`}
                  onClick={() => setSlideContent(true)}
                >
                  <div className="thumbnail-container overflow-hidden relative rounded-xl">
                    <img
                      className="object-cover w-full"
                      src={`https://play.vidyard.com/${playerUUID}.jpg`}
                      alt={`${title} thumbnail`}
                    />
                    <div className="play-button-svg absolute z-10 flex items-center justify-center">
                      <div className="relative h-full w-full flex items-center justify-center">
                        <div className=" absolute bg-white h-full w-full rounded-full opacity-50" />
                        <SVG src={IconPlayButton} alt="Play Button" />
                      </div>
                    </div>
                  </div>
                  <h5 className="text-charcoal text-xl font-bold mt-4 mb-2 leading-none">
                    {behaviorTitle}
                  </h5>
                  <p className="font-bold text-charcoal text-xs">
                    {Math.floor(videoLength / 60)}{' '}
                    {videoLength > 60 ? 'minutes' : 'minute'}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setExpanded();
          }}
          className="my-8 text-link-purple font-bold"
        >
          COLLAPSE BEHAVIORS
        </button>
      </section>
    </div>
  );
};

const MobileNavigation = ({ data, setSlideContent }) => {
  const [expanded, setExpanded] = useState();

  const { contentData } = useData();

  return (
    <div className="mobile-navigation-wrapper">
      {contentData?.modules?.map((module, index) => {
        return (
          <>
            <MobileNavigationItem
              expanded={expanded}
              setExpanded={setExpanded}
              module={module}
              position={index}
              setSlideContent={setSlideContent}
            />
            {index + 1 !== contentData.modules.length && (
              <span className="flex h-px bg-gray w-full" />
            )}
          </>
        );
      })}
    </div>
  );
};

const ProgramNavigation = ({ navigationSize, setNavigationSize }) => {
  const { setSlideContent } = useSlideContent();
  const { isTablet } = useResponsive();
  const [isModuleView, setIsModuleView] = useState(true);
  const [focusedModule, setFocusedModule] = useState();

  const [hoveredModule, setHoveredModule] = useState();
  const [hoveredModuleTitleWidth, setHoveredModuleTitleWidth] = useState(0);

  const { contentData } = useData();

  const ref = useRef(null);

  useEffect(() => {
    ref?.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [focusedModule]);

  return (
    <div className="program-navigation-wrapper lg:fixed lg:pin-l lg:pin-t lg:h-screen bg-faint-charcoal">
      <div
        className={`program-navigation program-navigation--${navigationSize} relative lg:h-full`}
      >
        {!isTablet ? (
          <div
            ref={ref}
            style={{
              marginRight: hoveredModuleTitleWidth && '-120px',
              paddingTop: !isTablet && `90px`,
            }}
            className="overflow-y-scroll disable-scrollbars h-full"
          >
            <div className="program-navigation__inner flex py-32 w-full relative">
              <ModuleCircleList
                contentData={contentData}
                isModuleView={isModuleView}
                navigationSize={navigationSize}
                setNavigationSize={setNavigationSize}
                focusedModule={focusedModule}
                setFocusedModule={setFocusedModule}
                hoveredModule={hoveredModule}
                setHoveredModule={setHoveredModule}
                setHoveredModuleTitleWidth={setHoveredModuleTitleWidth}
              />

              {!focusedModule ? (
                <ModuleCardsList
                  contentData={contentData}
                  isModuleView={isModuleView}
                  navigationSize={navigationSize}
                  focusedModule={focusedModule}
                  setFocusedModule={setFocusedModule}
                  hoveredModule={hoveredModule}
                  setHoveredModule={setHoveredModule}
                />
              ) : (
                <BehaviorInDetail
                  focusedModule={focusedModule}
                  navigationSize={navigationSize}
                  setNavigationSize={setNavigationSize}
                />
              )}

              {navigationSize !== 0 && (
                <div className="absolute module-toggle-button">
                  {focusedModule ? (
                    <button
                      type="button"
                      className="text-sm font-black text-link-purple uppercase"
                      onClick={() => setFocusedModule()}
                    >
                      See All Modules
                    </button>
                  ) : (
                    <h6 className="text-sm font-black text-charcoal uppercase">
                      Modules
                    </h6>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <MobileNavigation setSlideContent={setSlideContent} />
        )}
        <NavigationSizeSetButton
          navigationSize={navigationSize}
          setNavigationSize={setNavigationSize}
          setIsModuleView={setIsModuleView}
        />
      </div>
    </div>
  );
};

export default ProgramNavigation;
