import React, { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import SVG from "react-inlinesvg";
import { useMutation, useQueryClient } from "react-query";
import classNames from "classnames";
import useData from "../context/DataContext";
import IconPlayButton from "../../../../assets/images/reskin-images/icon--play-v2.svg";
import IconPlayButtonSm from "../../../../assets/images/reskin-images/icon--play-v2-sm";
import useResponsive from "../hooks/useResponsive";
import { userAPI } from "../api";

const VideoPlayer = ({
  behavior,
  module,
  className,
  pauseState,
  mini,
  ...rest
}) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(userAPI.updateUserWatchStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries("contentData");
    },
  });
  const [isSettingStatus, setIsSettingStatus] = useState(false);
  const player = useRef();
  const { player_uuid: playerUUID } = behavior;
  const vidyardPlayerURL = `https://video.vidyard.com/watch/${playerUUID}`;

  const { videoMap, setVideoMap, setLatestVideo } = useData();

  const timerRef = useRef(0);

  const [showInitialThumbnail, setShowInitialThumbnail] = useState(true);
  const [isViewAll, setIsViewAll] = useState(false);

  useEffect(() => {
    setIsSettingStatus(false);
  }, [behavior]);

  useEffect(() => {
    if (pauseState) {
      player.current.getInternalPlayer().pause();
    }
  }, [pauseState]);

  useEffect(() => {
    setShowInitialThumbnail(true);

    // set the video pause time when the component unmounts
    return () => {
      if (timerRef.current !== 0) {
        setVideoMap({
          ...videoMap,
          [playerUUID]: { pausedAt: timerRef.current },
        });
        timerRef.current = 0;
      }
    };
  }, [playerUUID, videoMap]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const queryParams = new URLSearchParams(url.search);
    const viewParam = queryParams.get("view");

    if (viewParam === "all") {
      setIsViewAll(true);
    }
  }, []);

  const onPlay = () => {
    setShowInitialThumbnail(false);
    const { pausedAt } = videoMap[playerUUID];
    if (timerRef.current === 0) {
      player.current.seekTo(pausedAt, "seconds");
    }
  };

  const onReady = () => {
    if (!videoMap[playerUUID]) {
      setVideoMap({
        ...videoMap,
        [playerUUID]: { pausedAt: 0 },
      });
    }
    if (!isViewAll) {
      setLatestVideo({ module: module.id, behavior: behavior.id });
    }
    onPlay();
  };

  const onProgress = (state) => {
    if (state.playedSeconds !== 0) {
      timerRef.current = state.playedSeconds;
    }

    const remainingSeconds =
      player?.current?.getDuration() - state.playedSeconds;
    if (remainingSeconds <= 15 && !behavior.completed && !isSettingStatus) {
      setIsSettingStatus(true);
      mutate({ behaviorId: behavior.id, status: "completed" });
    }
  };
  const onEnded = () => {
    setVideoMap({
      ...videoMap,
      [playerUUID]: { pausedAt: 0 },
    });
  };

  // const skipForward = () => {
  //   const currentTime = player.current.getCurrentTime();
  //   player.current.seekTo(currentTime + 15, 'seconds');
  // };

  // const skipBackward = () => {
  //   const currentTime = player.current.getCurrentTime();
  //   player.current.seekTo(currentTime - 15, 'seconds');
  // };

  const thumbNailOnClick = () => {
    player.current.getInternalPlayer().play();
    setShowInitialThumbnail(false);
  };

  const { isMobile } = useResponsive();

  return (
    <div
      className={classNames(
        "video-player overflow-hidden relative",
        className,
        { "video-player--mini": mini },
      )}
    >
      {showInitialThumbnail && (
        <button
          type="button"
          className="absolute pin-t pin-l w-full h-full z-50"
          onClick={() => {
            thumbNailOnClick();
          }}
        >
          <div className="relative w-full h-full">
            <img
              src={`https://play.vidyard.com/${playerUUID}.jpg`}
              alt="Video Thumbnail"
              className="w-full h-full"
            />
            <div
              className={`${mini || isMobile ? "play-button-svg" : "play-button-svg--lg"
                } absolute z-10 flex items-center justify-center`}
            >
              <div className="relative h-full w-full flex items-center justify-center">
                <div className=" absolute bg-white h-full w-full rounded-full opacity-50" />
                <SVG
                  src={mini || isMobile ? IconPlayButtonSm : IconPlayButton}
                  alt="Play Button"
                />
              </div>
            </div>
          </div>
        </button>
      )}

      <ReactPlayer
        ref={player}
        key={playerUUID}
        url={vidyardPlayerURL}
        onPlay={onPlay}
        onReady={onReady}
        onProgress={onProgress}
        onEnded={onEnded}
        {...rest}
      />
      {/* <div className="video-player-forward-backward-buttons">
        <button type="button" onClick={skipBackward} className="skip-backward">
          <SVG src={IconBackward} />
        </button>
        <button type="button" onClick={skipForward} className="skip-forward">
          <SVG src={IconForward} />
        </button>
      </div> */}
    </div>
  );
};

export default VideoPlayer;
