import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { ContentContext } from '../context/ContentContext';
import useReactPlayer from '../hooks/useReactPlayer';

const PlayIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="43"
    fill="none"
    className="ml-1"
  >
    <g filter="url(#a)">
      <path fill="#fff" d="M29.54 17.932 10.49 28.931V6.934l19.05 10.998Z" />
    </g>
    <defs>
      <filter
        id="a"
        width="39.05"
        height="41.997"
        x=".49"
        y=".934"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1897_825"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_1897_825"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

const PauseIcon = (
  <div
    style={{ height: '24px', width: '20px', gap: '8px' }}
    className="flex mb-2"
  >
    <span className="bg-white rounded h-full w-1/2" />
    <span className="bg-white rounded h-full w-1/2" />
  </div>
);

const GlossyButton = ({
  onClick,
  icon,
  falseyIcon,
  toggleState,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={`glossy-button rounded-full flex items-center justify-center ${className}`}
    >
      <div className="glossy-button__icon">
        {toggleState ? falseyIcon : icon}
      </div>
    </button>
  );
};

function ScrollingText({ text, width }) {
  const [animating, setAnimating] = useState(false);
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState();

  useEffect(() => {
    const tw = textRef.current.offsetWidth;
    setTextWidth(tw);

    if (tw > width) {
      setAnimating(true);
    } else {
      setAnimating(false);
    }
  }, [text, width]);

  return (
    <div
      className={`scrolling-text-container relative ${
        animating ? 'animating' : ''
      }`}
      style={{ width: `${width}px`, overflow: 'hidden' }}
    >
      <div
        ref={textRef}
        style={{ paddingRight: textWidth && textWidth + width }}
        className="scrolling-text text-md text-white font-extrabold"
      >
        {text}
      </div>

      <div
        style={{ paddingLeft: textWidth && textWidth + width }}
        className="scrolling-text-second text-md text-white font-extrabold pin-l absolute"
      >
        {text}
      </div>
    </div>
  );
}

const AudioBar = () => {
  const { showModal, setModule } = useContext(ContentContext);

  const playerRef = useRef();
  const {
    handleProgress,
    vidyardBaseURL,
    latestVideo,
    onPlay,
    playing,
    setPlaying,
    onEnded,
  } = useReactPlayer({
    playerRef,
  });

  return (
    latestVideo &&
    latestVideo.behavior &&
    latestVideo.module &&
    !showModal && (
      <div
        className={`audio-bar fixed w-full bg-black shadow z-50 flex items-center overflow-hidden ${
          showModal && 'audio-bar--hide'
        }`}
      >
        <div className="px-2 py-2 mr-2 md:px-4 md:py-5 md:mr-4">
          <GlossyButton
            icon={PlayIcon}
            falseyIcon={PauseIcon}
            toggleState={playing}
            onClick={() => setPlaying(!playing)}
            className="glossy-button--darker"
          />
        </div>
        <div className="">
          <h6 className="text-white md:text-xs md:text-purple-500 md:font-extrabold">
            {playing ? 'PAUSE' : 'CONTINUE LISTENING'}
          </h6>
          <button
            type="button"
            className="flex flex-col items-start"
            onClick={() =>
              setModule({
                module: latestVideo.module,
                behavior: latestVideo.behavior,
              })
            }
          >
            <h4 className="text-md text-white font-extrabold whitespace-no-wrap">
              {latestVideo.behavior && latestVideo.behavior.title}
            </h4>
            {/* <ScrollingText
              width={300}
              text={latestVideo.behavior && latestVideo.behavior.title}
            /> */}
            <h6 className="text-sm text-white hidden md:block  ">
              {latestVideo.module && latestVideo.module.title}
            </h6>
          </button>
        </div>
        {latestVideo.behavior && (
          <ReactPlayer
            onPlay={onPlay}
            url={vidyardBaseURL + latestVideo.behavior.player_uuid}
            onProgress={handleProgress}
            playing={playing}
            ref={playerRef}
            onEnded={onEnded}
            controls
            playsinline
            poster="false"
            width="0"
            height="0"
          />
        )}
      </div>
    )
  );
};

export default AudioBar;
