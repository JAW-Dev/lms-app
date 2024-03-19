import React, { useState } from 'react';
import { useQuery } from 'react-query';
import VideoPlayer from '../components/VideoPlayer';
// API
import { habitAPI } from '../api';
// Hooks
import useResponsive from '../hooks/useResponsive';
// Context
import useData from '../context/DataContext';
import useAuth from '../context/AuthContext';
// Helpers
import formatBehaviorTitles from '../helpers/formatBehaviorTitles';
import { convertVideoTime } from '../helpers';

/**
 * HelpToHabitCallout component
 *
 * @component
 * @returns JSX.Element
 */
const HelpToHabitCallout = () => {
  const { isXXLarge } = useResponsive();
  const { contentData } = useData();
  const { isCarneyTeam } = useAuth();
  const modules = contentData?.modules;

  // add state for image loading
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get the last completed behavior
  const lastCompletedBehavior = contentData?.latest_completed;

  const newModules = modules;

  // Fetch habits related to the current behavior
  const { data: habits, isLoading } = useQuery(
    'currentBehaviorHabits',
    () => habitAPI.getBehaviorHabits({ behaviorID: lastCompletedBehavior?.id }),
    {
      enabled: !!lastCompletedBehavior,
    }
  );

  if (!isCarneyTeam || !lastCompletedBehavior || !isLoading || !habits) {
    return null;
  }

  // Define current habit, module, and behavior
  const currentModule = newModules?.find(
    (module) => module.id === lastCompletedBehavior?.course_id
  );
  const currentBehavior = currentModule?.behaviors?.find(
    (behavior) => behavior.id === lastCompletedBehavior?.id
  );

  const currentHabit = habits?.[0];

  // Define behavior numbering
  const behaviorNumbering = currentBehavior?.behaviorNumber
    ? currentBehavior.behaviorNumber + ' ' + currentModule?.title
    : currentModule?.title;

  // Handler for the loaded event of the habit image
  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  // Handler for the error event of the habit image
  const handleImageError = () => {
    setImageLoaded(false);
  };

  // Define styles
  const reminderSkeletonContainerStyles = {
    borderRadius: '32px',
    height: '353px',
  };

  const videoSkeletonContainerStyles = {
    borderRadius: '32px',
    minWidth: !isXXLarge ? '0' : '480px',
    maxWidth: !isXXLarge ? 'none' : '480px',
    height: '353px',
  };

  const reminderContainerStyles = {
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 10px 50px',
    borderRadius: '32px',
  };

  const videoContainerStyles = {
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 10px 50px',
    borderRadius: '32px',
    minWidth: !isXXLarge ? '0' : '480px',
    maxWidth: !isXXLarge ? 'none' : '480px',
  };

  // Skeleton UI for loading state
  const skeleton = (
    <div className="bg-white-faint w-full flex justify-center border-b border-gray-light">
      <div
        className="w-full container py-10 flex flex-col xl:flex-row"
        style={{ gap: '24px' }}
      >
        <div
          className="loading-colors px-8 py-6 w-full flex flex-col"
          style={reminderSkeletonContainerStyles}
        ></div>
        <div
          className="loading-colors p-8 w-full flex flex-col"
          style={videoSkeletonContainerStyles}
        ></div>
      </div>
    </div>
  );

  return (
    <>
      {isLoading ? (
        skeleton
      ) : (
        <div className="bg-white-faint w-full flex justify-center border-b border-gray-light">
          <div
            className="w-full container py-10 flex flex-col xl:flex-row"
            style={{ gap: '24px' }}
          >
            <div
              className="bg-white px-8 py-6 w-full flex flex-col"
              style={reminderContainerStyles}
            >
              <div
                className="font-extrabold uppercase flex justify-between"
                style={{ fonstSize: '14px' }}
              >
                <div>Make leadership a habit</div>
                <div>
                  <a
                    href="/v2/help-to-habit"
                    className="text-link-purple"
                    style={{ width: 'max-content', display: 'inline-block' }}
                  >
                    View Help to habit
                  </a>
                </div>
              </div>

              <div
                className="flex flex-col md:flex-row justify-center items-start md:items-center"
                style={{ gap: '24px', padding: '63px 0' }}
              >
                <div
                  style={{
                    background: '#f1f1f1',
                    minWidth: '189px',
                    height: '185.88px',
                  }}
                  className="habit-card__img-wrapper flex items-center justify-center overflow-hidden rounded-full relative"
                >
                  <img
                    src={currentHabit?.image?.url}
                    alt="Habit Card"
                    onLoad={handleImageLoaded}
                    onError={handleImageError}
                    style={{ display: !imageLoaded && 'none' }}
                  />
                  {!imageLoaded && (
                    <div className="loading-colors w-full h-full absolute pin-t pin-l" />
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '24px',
                      lineHeight: '32px',
                      paddingBottom: '10px',
                    }}
                  >
                    {currentHabit?.description}
                  </p>
                  <p>
                    <a
                      href={`/v2/program/${lastCompletedBehavior?.course_id}/${lastCompletedBehavior?.id}`}
                    >
                      {behaviorNumbering}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-white px-8 py-6 w-full flex flex-col"
              style={videoContainerStyles}
            >
              <div
                className="font-extrabold uppercase flex justify-between"
                style={{ fonstSize: '14px' }}
              >
                <div>Watch Again</div>
                <div>
                  <a
                    href={`/v2/program/${currentModule?.id}/${currentBehavior?.id}`}
                    className="text-link-purple"
                    style={{ width: 'max-content', display: 'inline-block' }}
                  >
                    View Module
                  </a>
                </div>
              </div>
              <div style={{ paddingTop: '19px' }}>
                {currentBehavior?.player_uuid && (
                  <VideoPlayer
                    behavior={currentBehavior}
                    module={currentModule}
                    className="w-full"
                    height="100%"
                    width="100%"
                  />
                )}
                <p
                  className="font-extrabold"
                  style={{ paddingTop: '19px', fontSize: '24px' }}
                >
                  {lastCompletedBehavior?.title}
                </p>
              </div>
              <div
                className="font-bold uppercase"
                style={{ marginTop: 'auto' }}
              >
                {convertVideoTime(lastCompletedBehavior?.video_length)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpToHabitCallout;
