import React, { useState, useEffect } from 'react';
import useData from '../context/DataContext';
import Container from './Container';
import VideoPlayer from './VideoPlayer';
import Text from './Text';
import Button from './Button';
import LinearProgressBar from './LinearProgressBar';

const IntroductionLoadingPlaceHolder = () => {
  return (
    <>
      <div className="introduction--text flex flex-col py-20 xl:border-r border-gray-dark xl:pr-16">
        <div className="loading-colors h-4 mb-3 xl:mb-8" />
        <div className="loading-colors h-12 mb-2" />
        <div className="loading-colors h-12 mb-3 xl:mb-8" />
        <div style={{ gap: '4px' }} className="flex flex-col">
          <div className="loading-colors h-4" />
          <div className="loading-colors h-4" />
          <div className="loading-colors h-4" />
          <div className="loading-colors h-4" />
        </div>
        <div className="loading-colors h-12 mt-12" />
      </div>
      <div className="xl:px-10 flex flex-col justify-center flex-auto mb-10 xl:mb-0">
        <div className="hidden xl:block loading-colors h-4 mb-4" />
        <div
          style={{ aspectRatio: '16 / 7' }}
          className="loading-colors w-full mb-8"
        />
        <div className="loading-colors h-8 xl:h-12" />
      </div>
    </>
  );
};

const IntroductionTextContent = ({ displayed }) => {
  const { isReturningUser, module } = displayed;

  const bottomSection = isReturningUser ? (
    <div className="flex flex-col mt-6">
      <LinearProgressBar module={module} />
      <div className="mt-6 hidden xl:flex">
        <Button
          to={`/v2/program/${displayed?.module?.id}/${displayed?.behavior?.id}`}
          className="mt-8 hidden xl:flex mr-3"
        >
          Open Module
        </Button>
        <Button
          to={`/v2/program/2/15?view=all`}
          className="mt-8 hidden xl:flex uppercase"
          variant="outline"
        >
          View All Modules
        </Button>
      </div>
    </div>
  ) : (
    <div className="mt-8 pt-8 flex flex-col relative">
      <span className="h-px w-screen bg-gray-dark absolute pin-t pin-r -mr-16" />
      <Text size="p" variant="p-1">
        View the full journey in the module player to access resources
        associated with each lesson.
      </Text>
      <div className="mt-6 hidden xl:flex">
        <Button
          to={`/v2/program/${displayed?.module?.id}/${displayed?.behavior?.id}`}
          className="uppercase"
        >
          Explore Modules
        </Button>
      </div>
    </div>
  );

  return (
    <div className="introduction--text flex flex-col py-20 xl:border-r border-gray-dark xl:pr-16">
      <Text size="sm" variant="bold" className="mb-3 xl:mb-8">
        {isReturningUser
          ? 'PICK UP WHERE YOU LEFT OFF'
          : 'START YOUR LEADERSHIP JOURNEY'}
      </Text>
      <Text size="h1" variant="h1" className="mb-3 xl:mb-8">
        {module.title}
      </Text>
      {module.title === 'Foundations' && (
        <Text size="p" variant="p-l">
          {module.description}
        </Text>
      )}
      {bottomSection}
    </div>
  );
};

export const BehaviorProgressText = ({ module, behavior }) => {
  const { title, behaviors } = module;
  const behaviorIndex = behaviors.findIndex((b) => b.id === behavior?.id) + 1;
  return (
    <Text size="h6" variant="bold">
      {title === 'Foundations'
        ? 'AN INTRODUCTION TO ADMIRED LEADERSHIP'
        : `BEHAVIOR ${behaviorIndex} OF ${module.behaviors.length}`}
    </Text>
  );
};

const IntroductionVideoSection = ({ displayed }) => {
  return (
    <div
      style={{ marginRight: '-100vw', paddingRight: '100vw' }}
      className="xl:px-10 flex flex-col justify-center flex-auto xl:bg-white"
    >
      <div className="hidden xl:flex justify-between items-center w-full mb-6">
        <BehaviorProgressText
          module={displayed?.module}
          behavior={displayed?.behavior}
        />
        <Button
          to={`/v2/program/${displayed?.module?.id}/${displayed?.behavior?.id}`}
          className="flex"
          variant="purpleText"
        >
          OPEN MODULE VIEW
        </Button>
      </div>

      {displayed?.behavior?.player_uuid && (
        <VideoPlayer
        behavior={displayed?.behavior}
        module={displayed?.module}
        className="w-full"
        height="100%"
        width="100%"
      />
      )}

      <div>
        <h6 className="text-sm font-normal uppercase mt-8" style={{color: '#828282'}}>
          {displayed?.behavior?.behaviorNumber}
        </h6>
      </div>
      <Text size="h3" variant="h4" className="mt-4">
        {displayed?.behavior?.title}
      </Text>
    </div>
  );
};

const Introduction = () => {
  const { contentData, latestVideo } = useData();
  const [displayed, setDisplayed] = useState();

  const setDisplayedHelper = async (moduleID, behaviorID, isReturningUser) => {
    if (!contentData) return;
    const { modules } = contentData;
    const module = await modules.find((obj) => obj.id === moduleID);
    const behavior = await module.behaviors.find((obj) => obj.id === behaviorID)|| modules?.[2]?.behaviors?.[15];

    setDisplayed({
      module,
      behavior,
      isReturningUser,
    });
  };

  useEffect(() => {
    if (!contentData) return;
    const { last_viewed: { behavior, module, new_user: newUser }} = contentData;

    if (latestVideo.behavior && latestVideo.module) {
      setDisplayedHelper(latestVideo.module, latestVideo.behavior, true);
      return;
    }

    if (newUser) {
      setDisplayedHelper(2, 15, true);
      return;
    }

    if (behavior && module) {
      setDisplayedHelper(module, behavior, true);
    }

    setDisplayedHelper(2, 15, true);
  }, [contentData]);

  return (
    <Container parentClassName="bg-faint-charcoal" borderBottom containerize>
      <div className="flex flex-col xl:flex-row">
        {displayed ? (
          <>
            {' '}
            <IntroductionTextContent displayed={displayed} />
            <IntroductionVideoSection displayed={displayed} />
            <div
              style={{ gap: '12px' }}
              className="flex items-center flex-wrap mt-3 mb-12 xl:hidden"
            >
              <Button
                to={`/v2/program/${displayed?.module?.id}/${displayed?.behavior?.id}`}
              >
                Open Module
              </Button>
              <Button
                to={`/v2/program/2/15?view=all`}
                variant="outline"
              >
                View All
              </Button>
            </div>
          </>
        ) : (
          <IntroductionLoadingPlaceHolder />
        )}
      </div>
    </Container>
  );
};

export default Introduction;
