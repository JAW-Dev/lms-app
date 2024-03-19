import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Onboarding carousel component that displays a slideshow of slides.
 *
 * @param {Object[]} slides - An array of slide objects.
 * @returns {JSX.Element} - OnboardingCarousel component.
 */
const OnboardingCarousel = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);

  /**
   * Handles the keydown event to navigate between slides using arrow keys.
   *
   * @param {Event} event - Keydown event object.
   */
  const handleKeyDown = useCallback(
    (event) => {
      const lastIndex = slides.length - 1;
      if (event.key === 'ArrowRight' && activeIndex < lastIndex) {
        setActiveIndex((prevIndex) => prevIndex + 1);
      } else if (event.key === 'ArrowLeft' && activeIndex > 0) {
        setActiveIndex((prevIndex) => prevIndex - 1);
      }
    },
    [activeIndex, slides.length]
  );

  /**
   * Navigates to the specified slide index.
   *
   * @param {number} index - Index of the slide to navigate to.
   */
  const goToSlide = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  /**
   * Starts the autoplay feature to automatically navigate through slides.
   */
  const startAutoplay = useCallback(() => {
    timerRef.current = setInterval(() => {
      if (activeIndex < slides.length - 1) {
        setActiveIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(timerRef.current);
      }
    }, 5000); // Adjust the autoplay interval as needed (e.g., 5000ms = 5 seconds)
  }, [activeIndex, slides.length]);

  /**
   * Stops the autoplay feature.
   */
  const stopAutoplay = useCallback(() => {
    clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    // Adds event listener for keyboard navigation and starts autoplay on component mount
    window.addEventListener('keydown', handleKeyDown);
    startAutoplay();

    // Removes event listener and stops autoplay on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopAutoplay();
    };
  }, [handleKeyDown, startAutoplay, stopAutoplay]);

  useEffect(() => {
    // Resets the autoplay timer when the active slide changes
    stopAutoplay();
    startAutoplay();
  }, [activeIndex, stopAutoplay, startAutoplay]);

  /**
   * Renders the content of a slide.
   *
   * @param {string|React.ReactNode} content - Content of the slide.
   * @returns {JSX.Element} - Rendered content.
   */
  const renderContent = (content) => {
    if (typeof content === 'string' && /<\/?[a-z][\s\S]*>/i.test(content)) {
      // Render HTML content if it contains HTML tags
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    } if (typeof content === 'object' && React.isValidElement(content)) {
      // Render React element
      return content;
    }
    // Render regular text content
    return <p>{content}</p>;
  };

  return (
    <div className="carousel" role="region" aria-label="Image Carousel">
      <div className="carousel-slides" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div
            key={uuidv4()}
            className={index === activeIndex ? 'carousel-slide active' : 'carousel-slide'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: `translateX(${(index - activeIndex) * 100}%)`,
              transition: 'transform 0.5s ease-in-out'
            }}
          >
            <img src={slide.image} alt={`Slide ${index}`} />
            {(slide.subtitle || slide.blurb) && (
              <div className="pt-8 text-center" style={{ paddingBottom: '24px' }}>
                {slide.subtitle && renderContent(slide.subtitle)}
                {slide.blurb && renderContent(slide.blurb)}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {slides.length > 1 && slides.map((slide, index) => (
            <button
              type="button"
              key={uuidv4()} // Generate a unique UUID for each button key
              className={index === activeIndex ? 'carousel-dot active' : 'carousel-dot'}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
        ))}
      </div>
    </div>
  );
};
export default OnboardingCarousel;
