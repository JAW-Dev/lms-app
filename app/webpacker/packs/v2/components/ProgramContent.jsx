import React, { useState, useEffect, useRef } from 'react';
import { csrfToken } from '@rails/ujs';
import SVG from 'react-inlinesvg';
import { Link, useParams, useNavigate } from 'react-router-dom';
// Context
import useData from '../context/DataContext';
import { useSlideContent } from '../context/SlideContent';
import { useOverlay } from '../context/OverlayContext';
// Hooks
import useResponsive from '../hooks/useResponsive';
// Helpers
import { convertVideoTime } from '../helpers';
// Components
import VideoPlayer from './VideoPlayer';
import { ModuleCircle } from './ProgramNavigation';
import ContentTabs from './ContentTabs';
import Overlay from './Overlay';
// Images
import IconMiniVideo from '../../../../assets/images/reskin-images/icon--mini-video.svg';
import IconExpandVideo from '../../../../assets/images/reskin-images/icon--expand-video.svg';

const ProgramContent = ({ navigationSize, setNavigationSize }) => {
  const { overlay } = useOverlay();
  const { slideContent } = useSlideContent();
  const { contentData } = useData();
  const [displayed, setDisplayed] = useState();
  const [nextUp, setNextUp] = useState();
  const { moduleId: moduleIdParams, behaviorId: behaviorIdParams } = useParams();
  const [behaviorDetails, setBehaviorDetails] = useState();
  const navigate = useNavigate();
  const { isMobile, isTablet, isLg } = useResponsive();

  const setDisplayedHelper = async () => {
    if (!contentData) return;
    const { modules } = contentData;

    const module = await modules.find(
      (obj) => obj.id.toString() === moduleIdParams
    );

    const behavior = await module.behaviors.find(
      (obj) => obj.id.toString() === behaviorIdParams
    );

    if (!module?.enrolled_in && !behavior?.enrolled_in) {
      navigate('/v2');
    }

    let currBehavior;

    const behaviorIndex = (await module.behaviors.findIndex((b) => b.id === behavior.id)) + 1;

    if (module.behaviors[behaviorIndex]) {
      currBehavior = module.behaviors[behaviorIndex];
    } else {
      const moduleIndex = (await modules.findIndex((m) => m.id === module.id)) + 1;

      currBehavior = modules[moduleIndex].behaviors[0];
    }

    const obj = {
      url: `/v2/program/${module.id}/${currBehavior.id}`,
      title: currBehavior.title,
      time: convertVideoTime(currBehavior.video_length)
    };

    setNextUp(obj);

    setDisplayed({
      module,
      behavior,
      behaviorIndex
    });
  };

  useEffect(() => {
    setDisplayedHelper();
  }, [contentData, moduleIdParams, behaviorIdParams]);

  useEffect(() => {
    const getBeahviorDetails = () => {
      fetch('/api/v2/behaviors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': csrfToken()
        },
        body: JSON.stringify({
          behavior_id: behaviorIdParams
        })
      })
        .then((response) => response.json())
        .then((data) => setBehaviorDetails(data))
        .catch((error) => console.error(error));
    };

    getBeahviorDetails();
  }, [behaviorIdParams]);

  useEffect(() => {
    if (!isMobile) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [moduleIdParams, behaviorIdParams]);

  const ref = useRef(null);

  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [videoHover, setVideoHover] = useState(false);

  const miniButtonClick = () => {
    setIsMiniPlayer(!isMiniPlayer);
    setVideoHover(false);
  };

  return (
    displayed && (
      <div
        id="program-content"
        className={`program-content program-content--${
          slideContent && 'slide-in'
        } w-full bg-white h-full lg:h-auto fixed lg:static pin-t`}
        style={{ zIndex: !isLg && 998 }}
      >
        <div className={`hidden lg:flex float-left  program-content-filler h-full program-content-filler--${navigationSize}`} />
        <div id="program-content-wrapper" className="program-content-wrapper flex flex-col flex-auto items-center lg:items-start overflow-x-hidden relative">
          <h6 className="hidden lg:block text-sm font-black uppercase text-charcoal mb-8">
            Current Module: {displayed.module.title}
          </h6>

          <div
            style={{
              aspectRatio: '16 / 9',
              margin: isTablet && '0 calc(-5% * 100vw)'
            }}
            className=" w-screen lg:w-full mb-6"
            ref={ref}
          >
            {isMiniPlayer && (
              <button
                onClick={() => setIsMiniPlayer(false)}
                style={{ borderRadius: '32px' }}
                className="w-full h-full bg-gray flex items-center justify-center"
                type="button"
              >
                <SVG src={IconExpandVideo} />{' '}
                <p className="ml-2  ">Click to expand video here</p>
              </button>
            )}
            <div
              className={`z-50 ${isMiniPlayer && 'video-player-wrapper--mini'}`}
            >
              <div
                className="relative"
                onMouseEnter={() => setVideoHover(true)}
                onMouseLeave={() => setVideoHover(false)}
              >
                {!isMobile && videoHover && (
                  <button
                    onClick={() => miniButtonClick()}
                    type="button"
                    className="flex items-center justify-center absolute z-50"
                    style={{
                      top: isMiniPlayer ? '24px' : '30px',
                      right: isMiniPlayer ? 'calc(100% - 48px)' : '30px'
                    }}
                  >
                    <SVG src={isMiniPlayer ? IconExpandVideo : IconMiniVideo} />
                  </button>
                )}
                {displayed?.behavior?.player_uuid && (
                  <VideoPlayer
                    behavior={displayed.behavior}
                    module={displayed.module}
                    className="w-full"
                    height="100%"
                    width="100%"
                    mini={isMiniPlayer}
                  />
                )}
              </div>
              {isMiniPlayer && (
                <div className="p-4 bg-white">
                  <h6 className=" font-semibold text-base mb-2">
                    {displayed.behavior.title}
                  </h6>
                  <p className=" text-grey text-sm">
                    {displayed.module.title}
                  </p>
                </div>
              )}
            </div>
          </div>

          { isTablet && (<div className="full-w mb-0 lg:mb-4" style={{minWidth: '100%', color: '#828282'}}>
            <h6 className="text-sm font-normal uppercase text-left w-full" style={{minWidth: '100%', color: '#828282'}}>
              Current Module: {displayed.module.title}
            </h6>
          </div>)
          }


          <div
            style={{ borderRadius: '24px' }}
            className=" lg:hidden mt-6 mb-8 border border-gray p-4 w-full"
          >

            <div className="flex items-center mb-4">
              <ModuleCircle module={displayed.module} diameter={16} />
              <h6 className="ml-4 text-charcoal text-xs font-bold  uppercase">
                {displayed.behavior.behaviorNumber}
              </h6>
            </div>

            <h3 className="text-black font-bold  text-xl">
              {displayed.behavior.title}
            </h3>

            <span className="h-px w-full bg-gray mb-4 mt-6 flex" />

            {nextUp && (
              <Link
                type="button"
                to={nextUp.url}
                className="flex flex-col items-start w-full"
              >
                <div
                  type="button"
                  className="text-purple-500  font-sm mb-2"
                >
                  Up Next
                </div>
                <h6 className=" font-normal text-base text-charcoal">
                  {nextUp.title}
                </h6>
                <p className="text-xs text-charcoal ">
                  {nextUp.time}
                </p>
              </Link>
            )}
          </div>
          <h6 className="hidden lg:block text-sm font-bold text-charcoal uppercase">
            {displayed.behavior.behaviorNumber}
          </h6>

          <h2 id="behavior-title" className="hidden lg:block text-charcoal text-3xl font-black leading-none mt-3 mb-8">
            {displayed.behavior.title}
          </h2>
          {behaviorDetails ? (
            <ContentTabs
              behaviorDetails={behaviorDetails}
              displayed={displayed}
            />
          ) : null}
        </div>
        {(overlay && isTablet) && (
          <Overlay />
        )}
      </div>
    )
  );
};

export default ProgramContent;
