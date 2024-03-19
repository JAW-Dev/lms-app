import { useEffect, useState } from 'react';

const useResponsive = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: windowWidth < 576, // sm: '0px to 575px'
    isSm: windowWidth >= 576, // sm: '576px and up'
    isMd: windowWidth >= 768, // md: '768px and up'
    isLg: windowWidth >= 992, // lg: '992px and up'
    isXl: windowWidth >= 1200, // xl: '1200px and up'
    isTablet: windowWidth <= 768,
    isLarge: windowWidth > 768 && windowWidth <= 992,
    isXLarge: windowWidth > 992 && windowWidth <= 1200,
    isXXLarge: windowWidth > 1200,
    windowHeight,
  };
};

export default useResponsive;
