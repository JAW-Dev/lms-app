// CustomHorizontalCarousel.js
import React, { useRef, useState, useEffect } from 'react';

import SVG from 'react-inlinesvg';
import ChevronLeft from '../../../../assets/images/reskin-images/icon--chevron-left.svg';
import ChevronRight from '../../../../assets/images/reskin-images/icon--chevron-right.svg';

const CustomHorizontalCarousel = ({ children, isBehaviorTab, activeTab, overlay }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef(null);

  const dragMultiplier = 10; // Adjust this value to change the sensitivity of the dragging

  useEffect(() => {
    const checkOverflow = () => {
      if (carouselRef.current) {
        setIsOverflowing(
          carouselRef.current.scrollWidth > carouselRef.current.clientWidth
        );
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  const updateScrollPosition = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };

  useEffect(() => {
    carouselRef.current.addEventListener('scroll', updateScrollPosition);
    return () => {
      if (carouselRef?.current) {
        carouselRef.current.removeEventListener('scroll', updateScrollPosition);
      }
    };
  }, []);

  

  useEffect(() => {
    if (overlay && isBehaviorTab && activeTab && carouselRef.current) {
      const tab = carouselRef.current.querySelector(`button[id=${activeTab}]`);
      if (tab) {
        const tabRect = tab.getBoundingClientRect();
        const carouselRect = carouselRef.current.getBoundingClientRect();
        const scrollLeft = carouselRef.current.scrollLeft +
          tabRect.left -
          carouselRect.left -
          90; // Adjust the value as needed for alignment
  
        carouselRef.current.scrollTo({ left: scrollLeft, behavior: 'instant' });
      }
    }
  }, [activeTab, isBehaviorTab, children]);

  const handleMouseDown = (e) => {
    if (isOverflowing) {
      setIsDragging(true);
      setStartPosition(e.clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && isOverflowing) {
      e.preventDefault();
      const newPosition = e.clientX;
      const scrollAmount = (newPosition - startPosition) * dragMultiplier;
      carouselRef.current.scrollLeft = scrollPosition - scrollAmount;
      setStartPosition(newPosition);
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const showLeftButton = isOverflowing && scrollPosition > 0;
  const showRightButton =
    isOverflowing &&
    carouselRef.current &&
    scrollPosition <
      carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

  return (
    <div className="carousel-container relative">
      {!overlay && showLeftButton && (
        <button
          id="left-scroll-button"
          type="button"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9136029411764706) 80%, rgba(255,255,255,0) 100%)',
            bottom: '4px',
          }}
          className="absolute pin-b z-10 pr-6 h-full flex items-center justify-center"
          onClick={() =>
            carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' })
          }
        >
          <SVG src={ChevronLeft} />
        </button>
      )}
      <div
        className="custom-horizontal-carousel"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {children}
      </div>
      {!overlay && showRightButton && (
        <button
          id="right-scroll-button"
          type="button"
          style={{
            background:
              'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9136029411764706) 80%, rgba(255,255,255,0) 100%)',
            bottom: '4px',
          }}
          className="absolute pin-r pin-b z-10 pl-6 h-full flex items-center justify-center"
          onClick={() =>
            carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' })
          }
        >
          <SVG src={ChevronRight} />
        </button>
      )}
    </div>
  );
};

export default CustomHorizontalCarousel;
