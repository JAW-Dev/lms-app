import React, { useContext, useEffect, useState } from 'react';
import { ContentContext } from '../context/ContentContext';

const useReactPlayer2 = ({ playerRef }) => {
  const vidyardBaseURL = 'https://video.vidyard.com/watch/';

  const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
  };
  const { contentData, showModal } = useContext(ContentContext);

  const [playing, setPlaying] = useState(false);
  const [videoMap, setVideoMap] = useState(getLocalStorage('videoMap') || {});
  const [latestVideo, setLatestVideo] = useState(
    getLocalStorage('latestVideo')
  );

  useEffect(() => {
    if (contentData.behavior && contentData.module) {
      setLatestVideo({
        behavior: contentData.behavior,
        module: contentData.module,
      });
    }
  }, [contentData]);

  const insertIntoVideoMap = (key, value) => {
    setVideoMap({
      ...videoMap,
      [key]: value,
    });
  };

  useEffect(() => {
    if (latestVideo && latestVideo.behavior && !contentData.behavior) {
      const currentPlayerUUID = latestVideo.behavior.player_uuid;
      if (!videoMap[currentPlayerUUID]) {
        insertIntoVideoMap(currentPlayerUUID, { pausedAt: 0 });
      }
    }
    if (contentData && contentData.behavior) {
      const currentPlayerUUID = contentData.behavior.player_uuid;
      if (!videoMap[currentPlayerUUID]) {
        insertIntoVideoMap(currentPlayerUUID, { pausedAt: 0 });
      }
    }
  }, [contentData]);

  useEffect(() => {
    localStorage.setItem('videoMap', JSON.stringify(videoMap));
  }, [videoMap]);

  const handleProgress = (state) => {
    if (state.playedSeconds !== 0) {
      setVideoMap({
        ...videoMap,
        [latestVideo.behavior.player_uuid]: { pausedAt: state.playedSeconds },
      });
    }
  };

  useEffect(() => {
    setPlaying(false);
  }, [showModal]);
  const onPlay = () => {
    const { pausedAt } =
      getLocalStorage('videoMap')[latestVideo.behavior.player_uuid];
    playerRef.current.seekTo(pausedAt, 'seconds');
  };

  const onEnded = () => {
    setPlaying(false);
    setVideoMap({
      ...videoMap,
      [latestVideo.behavior.player_uuid]: { pausedAt: 0 },
    });
  };
  return {
    handleProgress,
    vidyardBaseURL,
    latestVideo,
    onPlay,
    playing,
    setPlaying,
    onEnded,
  };
};

export default useReactPlayer2;
