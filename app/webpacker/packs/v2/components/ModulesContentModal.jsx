import React, { useRef, useState, useEffect, useContext } from 'react';
import SVG from 'react-inlinesvg';
import ReactPlayer from 'react-player';

import MinimizeIcon from '../../../../assets/images/reskin-images/icon--minimize.svg';
import XBlackIcon from '../../../../assets/images/reskin-images/icon--x-black.svg';
import PlayWhiteIcon from '../../../../assets/images/reskin-images/icon--play-white.svg';
import ChevronDownIcon from '../../../../assets/images/reskin-images/icon--chevron-down.svg';
import Behavior1Icon from '../../../../assets/images/reskin-images/icon--behavior1.svg';
// import Behavior2Icon from '../../../../assets/images/reskin-images/icon--behavior2.svg';
// import Behavior3Icon from '../../../../assets/images/reskin-images/icon--behavior3.svg';
// import Behavior4Icon from '../../../../assets/images/reskin-images/icon--behavior4.svg';
// import Behavior5Icon from '../../../../assets/images/reskin-images/icon--behavior5.svg';
import CircularProgressBar from './CircularProgressBar';
import { ContentContext } from '../context/ContentContext';
import useStopScrolling from '../hooks/useStopScrolling';
import useReactPlayer from '../hooks/useReactPlayer';

const ModualHeader = ({ module }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 27) {
        const button = document.querySelector('#modal-close-button');
        button.click();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const { setShowModal } = useContext(ContentContext);

  return (
    <div className="container">
      <div className="pt-10 md:py-10 flex w-full items-start">
        <h3
          style={{ borderRadius: '25px' }}
          className="text-white font-extrabold font-sans py-2 px-4 bg-purple-500 mr-4 mt-1 whitespace-no-wrap"
        >
          {module.title === 'Foundations'
            ? module.title
            : 'MODULE ' + (module.position - 1).toString()}
        </h3>

        {module.title !== 'Foundations' && (
          <h2 className="hidden md:block font-extrabold font-sans text-charcoal text-4xl">
            {module.title}
          </h2>
        )}

        <div className="flex items-center bg-grey-lighter rounded-xl ml-auto">
          <button
            style={{ transform: 'translateY(1px)' }}
            type="button"
            className="py-3 px-4 rounded-l-xl bg-grey-lighter"
          >
            <SVG src={MinimizeIcon} alt="Minimize" />
          </button>
          <span
            style={{ width: '2px', height: '26px', borderRadius: '38px' }}
            className="bg-white"
          />
          <button
            id="modal-close-button"
            onClick={() => {
              setShowModal(false);
            }}
            style={{ transform: 'translateY(1px)' }}
            type="button"
            className="py-3 px-4 rounded-r-xl bg-grey-lighter"
          >
            <SVG src={XBlackIcon} alt="Exit" />
          </button>
        </div>
      </div>
      <h2 className="md:hidden font-extrabold font-sans text-charcoal text-4xl mb-8">
        {module.title}
      </h2>
    </div>
  );
};

const BehaviorDropdown = ({ title, children }) => {
  const [collapse, setCollapse] = useState(true);
  const collapsibleRef = useRef();
  const collapsibleMenuHeight =
    collapsibleRef &&
    collapsibleRef.current &&
    collapsibleRef.current.scrollHeight;

  return (
    <div
      style={{
        borderRadius: '32px',
        boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.1)',
        transition: 'height ease 0.3s',
      }}
      className="w-full bg-white p-6 cursor-pointer"
      onClick={() => setCollapse(!collapse)}
    >
      <div className="flex items-center">
        <span
          className={`h-4 w-4 rounded-full mr-4 ${
            collapse ? 'bg-gray' : 'bg-green-500'
          }`}
        />
        <h6 className="text-charcoal font-bold text-xl font-sans">{title}</h6>
        <SVG
          className="ml-auto"
          style={{ transform: !collapse && 'rotate(180deg)' }}
          src={ChevronDownIcon}
          alt="Arrow"
        />
      </div>
      {/* Collapsible */}
      <div
        ref={collapsibleRef}
        style={{ height: collapsibleMenuHeight }}
        className={`${
          !collapse ? 'show-collapsible-menu' : 'hide-collapsible-menu'
        }`}
      >
        <div
          style={{ borderRadius: '24px' }}
          className="border border-grey-ligher p-8 mt-6"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const BehaviorMaps = ({ behaviorMaps }) => {
  return (
    <div className="flex flex-col">
      {behaviorMaps.map((behavior, index) => {
        const {
          description,
          image: { url },
        } = behavior;

        const isEven = index % 2 === 0;

        return (
          <div
            key={behavior.id}
            style={{ minHeight: '124px', gap: '24px' }}
            className={`relative items-center flex pb-8 border-b border-gray flex-col ${
              isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
            } ${index !== 0 && 'mt-8'} `}
          >
            <div
              style={{
                minHeight: '124px',
                minWidth: '124px',
                height: '124px',
                width: '124px',
                boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.1)',
              }}
              className="flex justify-center items-center rounded-full"
            >
              <img src={Behavior1Icon} alt="" />
            </div>
            <p
              // style={{ marginLeft: isEven && '84px', marginRight: !isEven && '84px' }}
              className="font-bold text-charcoal"
            >
              {description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const GenericList = ({ data }) => {
  return (
    <div style={{ gap: '16px' }} className="flex flex-col">
      {data.map((curr) => {
        const { position, description } = curr;
        return (
          <div key={crypto.randomUUID()}>
            <h4 className="text-3xl pb-1 border-b border-gray text-black">
              {position}.
            </h4>
            <p className="font-sans">{description}</p>
          </div>
        );
      })}
    </div>
  );
};

export const BehaviorBundleSection = ({ isFoundations, behaviorBundle }) => {
  const { behavior_maps, examples, exercises, questions } = behaviorBundle;

  return (
    <div className="behavior-bundle-section flex flex-col">
      {behavior_maps.length ? (
        <BehaviorDropdown
          title={isFoundations ? 'Foundation Map' : 'Behavior Map'}
        >
          <BehaviorMaps behaviorMaps={behaviorBundle.behavior_maps} />
        </BehaviorDropdown>
      ) : null}

      {examples.length ? (
        <BehaviorDropdown title="Examples">
          <GenericList data={examples} />
        </BehaviorDropdown>
      ) : null}
      {exercises.length ? (
        <BehaviorDropdown title="Discussion Questions">
          <GenericList data={exercises} />
        </BehaviorDropdown>
      ) : null}
      {questions.length ? (
        <BehaviorDropdown title="Exercises">
          <GenericList data={questions} />
        </BehaviorDropdown>
      ) : null}
      {/* <BehaviorDropdown title="Gift this behavior" /> */}
    </div>
  );
};

const MiniBehaviorCard = ({ behavior, borderTop, module, className }) => {
  const {
    title,
    player_uuid: playerUUID,
    video_length: videoLength,
  } = behavior;
  const { setModule } = useContext(ContentContext);

  return (
    <div
      onClick={() => setModule({ module, behavior })}
      className={`flex w-full md:w-1/2 cursor-pointer ${
        borderTop && 'py-8 border-t border-gray'
      } ${className}`}
    >
      <button
        type="button"
        style={{
          minWidth: '95px',
          minHeight: '95px',
          width: '95px',
          height: '95px',
          borderRadius: '16px',
        }}
        className="relative mr-3"
      >
        <img
          style={{ borderRadius: '16px' }}
          className="object-cover h-full"
          src={`https://play.vidyard.com/${playerUUID}.jpg`}
          alt={title}
        />
        <SVG
          className="absolute m-auto pin-t pin-b pin-l pin-r"
          src={PlayWhiteIcon}
          alt="Play Icon White"
        />
      </button>
      <div className="">
        <h5 className="mb-1 text-charcoal font-bold text-lg md:text-xl font-sans">
          {title}
        </h5>
        <p className="text-gray font-bold font-sans">
          {Math.floor(videoLength / 60)}{' '}
          {videoLength > 60 ? 'minutes' : 'minute'}
        </p>
      </div>
    </div>
  );
};

const VidyardVideoSection = ({ behaviorIndex }) => {
  const playerRef = useRef();

  const {
    showModal,
    contentData: { behavior, module },
  } = useContext(ContentContext);

  const {
    handleProgress,
    vidyardBaseURL,
    latestVideo,
    onPlay,
    playing,
    onEnded,
  } = useReactPlayer({
    playerRef,
  });

  return (
    <>
      <div className="vidyard-video-section overflow-hidden">
        {showModal && (
          <ReactPlayer
            key={latestVideo.behavior.player_uuid}
            playing={playing}
            onPlay={onPlay}
            url={vidyardBaseURL + behavior.player_uuid}
            onProgress={handleProgress}
            onReady={onPlay}
            onEnded={onEnded}
            ref={playerRef}
            width="100%"
            height="100%"
          />
        )}
      </div>
      <div
        style={{
          borderBottomLeftRadius: '2rem',
          borderBottomRightRadius: '2rem',
        }}
        className="p-6 border-b border-l border-r border-gray-light w-full -mt-6"
      >
        <div className="flex items-center mb-4">
          <CircularProgressBar
            strokeWidth={8}
            percentage={((behaviorIndex + 1) / module.behaviors.length) * 100}
          />
          <h5 className="text-charcoal font-extrabold font-sans">
            {module.title === 'Foundations' ? 'FOUNDATION' : 'BEHAVIOR'}{' '}
            {behaviorIndex + 1} OF {module.behaviors.length}
          </h5>
        </div>
        <h3 className="text-charcoal font-extrabold text-2xl md:text-4xl">
          {behavior.title}
        </h3>
      </div>
    </>
  );
};

const BehaviorsList = ({ behaviorIndex, module, allCourses }) => {
  const [showAllBehaviors, setShowAllBehaviors] = useState(false);
  const nextModule = allCourses[module.position];
  const allNextBehaviors = module.behaviors.slice(
    behaviorIndex + 3,
    module.behaviors.length + 1
  );
  const nextTwoBehaviors = module.behaviors.slice(
    behaviorIndex + 1,
    behaviorIndex + 3
  );

  const collapsibleRef = useRef();
  const collapsibleMenuHeight =
    collapsibleRef &&
    collapsibleRef.current &&
    collapsibleRef.current.scrollHeight;

  return (
    <div
      style={{ borderRadius: '2rem' }}
      className="p-6 border border-gray-light"
    >
      <div className="flex w-full items-center justify-between mb-6">
        <h4 className="font-sans font-black text-purple-500">NEXT BEHAVIORS</h4>
        <button
          onClick={() => setShowAllBehaviors(!showAllBehaviors)}
          type="button"
          className="font-sans font-black text-link-purple"
          href=""
        >
          {showAllBehaviors ? 'SEE LESS' : 'SEE ALL'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:flex-wrap">
        {nextTwoBehaviors.length
          ? nextTwoBehaviors.map((behavior, index) => {
              return (
                <MiniBehaviorCard
                  behavior={behavior}
                  key={behavior.id}
                  module={module}
                  className={
                    index === 1 &&
                    'mt-8 md:mt-0 border-t border-gray pt-8 md:pt-0 md:border-t-0'
                  }
                />
              );
            })
          : null}
      </div>

      <div
        ref={collapsibleRef}
        style={{ height: collapsibleMenuHeight }}
        className={`${
          showAllBehaviors ? 'show-collapsible-menu' : 'hide-collapsible-menu'
        }`}
      >
        <div className="mt-8 flex flex-wrap">
          {nextTwoBehaviors.length
            ? allNextBehaviors.map((behavior) => {
                return (
                  <MiniBehaviorCard
                    borderTop
                    behavior={behavior}
                    key={behavior.id}
                    module={module}
                  />
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

const ContentVideosSection = ({ module, behavior, allCourses }) => {
  const behaviorIndex = module.behaviors
    .map((curr) => curr.id)
    .indexOf(behavior.id);

  return (
    <div className="content-video-section flex flex-col pb-8">
      <VidyardVideoSection behaviorIndex={behaviorIndex} />

      <BehaviorsList
        behaviorsList={[]}
        behaviorIndex={behaviorIndex}
        module={module}
        allCourses={allCourses}
      />
    </div>
  );
};

const ModulesContentModal = ({ coursesWithBehaviors }) => {
  const { contentData, showModal: display } = useContext(ContentContext);
  const { module, behavior, isLoading } = contentData;

  // const handleClose = useCallback(() => {
  //   allowScroll();
  //   if (typeof closeModal === 'function') closeModal();
  // }, [allowScroll, closeModal]);

  useStopScrolling(display);

  return (
    <div
      className={`fixed pin-b bg-white w-screen overflow-y-scroll disable-scrollbars module-content-modal
        ${
          display ? 'module-content-modal--open' : 'module-content-modal--close'
        }
      `}
    >
      {module && behavior && (
        <div className="">
          {/* Top Section */}
          <ModualHeader module={module} />

          {/* Content */}
          <div
            style={{ gap: '24px' }}
            className="h-full w-full flex container flex-col xl:flex-row pb-10"
          >
            <ContentVideosSection
              allCourses={coursesWithBehaviors}
              behavior={behavior}
              module={module}
            />
            <BehaviorBundleSection
              isFoundations={module && module.title === 'Foundations'}
              behaviorBundle={behavior.bundle}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesContentModal;
