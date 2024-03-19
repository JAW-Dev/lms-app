import React, { createContext, useContext, useState } from 'react';

const SlideContentContext = createContext();

export const useSlideContent = () => {
  return useContext(SlideContentContext);
};

export const SlideContentProvider = ({ children }) => {
  const [slideContent, setSlideContent] = useState(false);

  return (
    <SlideContentContext.Provider value={{ slideContent, setSlideContent }}>
      {children}
    </SlideContentContext.Provider>
  );
};
