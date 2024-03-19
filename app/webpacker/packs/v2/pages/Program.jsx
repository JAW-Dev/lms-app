import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
// Context
import ProgramContent from '../components/ProgramContent';
import { useSlideContent } from '../context/SlideContent';
// Helpers
import useStopScrolling from '../hooks/useStopScrolling';
// Hooks
import useResponsive from '../hooks/useResponsive';
import useAuthRedirect from '../hooks/useAuthRedirect';
// Components
import ProgramNavigationV2 from '../components/ProgramNavigationV2';

const Program = () => {
  const [searchParams, _] = useSearchParams();
  const [navigationSize, setNavigationSize] = useState(searchParams.get('moduleView') ? 2 : 1); // Possible Values: 0, 1, 2
  const { slideContent } = useSlideContent();
  const { isTablet, isLg } = useResponsive();

  useAuthRedirect();
  useStopScrolling(slideContent && isTablet);

  return (
    <div className="flex relative w-full" >
      <ProgramNavigationV2
        navigationSize={navigationSize}
        setNavigationSize={setNavigationSize}
        isTablet={isTablet}
        isLg={isLg}
      />
      <ProgramContent
        navigationSize={navigationSize}
        setNavigationSize={setNavigationSize}
      />
    </div>
  );
};

export default Program;
