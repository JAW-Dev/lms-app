import React, { createContext, useContext, useState } from 'react';

const OverlayContext = createContext();

export const useOverlay = () => useContext(OverlayContext);

export const OverlayProvider = ({ children }) => {
  const [overlay, setOverlay] = useState(false);
  const [arrowLeft, setArrowLeft] = useState('-100px');
  const [arrowTop, setArrowTop] = useState('-100px');
  const [showPointer, setShowPointer] = useState(false);

  return (
    <OverlayContext.Provider value={{ 
      overlay,
      setOverlay,
      arrowLeft,
      setArrowLeft,
      arrowTop,
      setArrowTop,
      showPointer,
      setShowPointer
    }}>
      {children}
    </OverlayContext.Provider>
  );
};