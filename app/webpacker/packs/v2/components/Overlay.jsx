import React, { useEffect, useRef } from 'react';
import { useOverlay } from '../context/OverlayContext';

const Overlay = (props) => {
  const { overlay, setOverlay } = useOverlay();
  const overlayRef = useRef(null);

  // Function to handle the fade-out effect
  const closeOverlay = () => {
    if (overlayRef.current) {
      overlayRef.current.style.opacity = '0';
      setTimeout(() => {
        setOverlay(false);
      }, 1000); // Set the duration to match the CSS transition duration
    }
  };

  // Handle the overlay visibility changes
  useEffect(() => {
    let timer;
    
    if (overlay) {
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '1';
      }

      timer = setTimeout(() => {
        if (overlayRef.current) {
          overlayRef.current.style.opacity = '0';
          setTimeout(() => {
            setOverlay(false);
          }, 1000); // Set the duration to match the CSS transition duration
        }
      }, 4000); // Fade out after 5 seconds
    }

    return () => clearTimeout(timer);
  }, [overlay, setOverlay]);

  // Extract the props
  const { className, style, ...otherProps } = props;

  // Merge the passed-in className with the base classes
  const classes = `w-full h-full fixed top-0 left-0 bottom-0 right-0 ${className || ''}`;

  // Merge the passed-in styles with the base styles
  const overlayStyles = {
    background: 'rgba(0, 0, 0, 0.50)',
    zIndex: '9999',
    transition: 'opacity 1s ease', // Transition for opacity change
    opacity: '1', // Initially set opacity to 0 for the fade-in effect
    top: 0,
    ...style,
  };

  return (
    <div
      ref={overlayRef}
      className={classes}
      style={overlayStyles}
      onClick={closeOverlay} // Close overlay on click (optional)
      {...otherProps}
    ></div>
  );
};

export default Overlay;