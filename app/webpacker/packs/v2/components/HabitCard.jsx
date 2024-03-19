import React, { useState } from 'react';

const HabitCard = ({
  habit,
  variant,
  imgShadow,
  disableFavorite,
  smallText,
  isLoading,
  showAll,
  toggleShowAll,
  index
}) => {

  const {
    description,
    id,
    image: {
      small: { url: imgURL }
    }
  } = habit;

  // add state for image loading
  const [imageLoaded, setImageLoaded] = useState(false);

  // handle image loaded
  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  // handle image loading error
  const handleImageError = () => {
    setImageLoaded(false);
  };

  const cardVariant = (
    <div className="habit-card p-6">
      <div style={{ gap: '24px' }} className="flex">
        <div className="habit-card__img-wrapper flex items-center justify-center overflow-hidden rounded-full mr-6">
          <img src={imgURL} alt="Habit Card" />
        </div>

        <p className="text-charcoal ">{description}</p>
      </div>

      {/* {favoriteButton} */}
    </div>
  );

  const wrapperClasses = !showAll && index === 2 ? 'md:items-start' : 'md:items-center';
  const wrapperStyles = !showAll && index === 2 ? {height: '30px', overflow: 'hidden', paddingTop: '42px', top: '10px' } : {};
  const buttonWrapperStyles = {
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 110%)',
    zIndex: '999',
    height: '120%'
  }
  const buttonStyles = {
    display: 'inline-flex',
    padding: '12px 16px',
    background: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0px 10px 50px 0px rgba(0, 0, 0, 0.20)',
    fontSize: '14px',
    fontWeight: '700',
    color: '#6357B5',
    position: 'relative',
    top: '5px'
  }

  const inlineVariant = (
    <div className="relative">
      {index === 2 && !showAll && (
        <div className="flex items-start justify-center text-center absolute pin-t pin-l w-full h-full" style={buttonWrapperStyles}>
          <button onClick={toggleShowAll} style={buttonStyles}>
            Show More
          </button>
        </div>
      )}
      <div className={`relative flex flex-col md:flex-row items-start ${wrapperClasses}`} style={wrapperStyles}>
        <div
          style={{ boxShadow: imgShadow && '0px 20px 50px rgba(0, 0, 0, 0.1)' }}
          className="habit-card__img-wrapper flex items-center justify-center overflow-hidden rounded-full mr-6 mb-4 md:mb-0 relative"
        >
          <img
            src={imgURL}
            alt="Habit Card"
            onLoad={handleImageLoaded}
            onError={handleImageError}
            style={{ display: !imageLoaded && 'none' }}
          />
          {!imageLoaded && (
            <div className="loading-colors w-full h-full absolute pin-t pin-l" />
          )}
        </div>
        <div style={{ gap: '16px' }} className="flex flex-col flex-auto">
          <p
            className={`text-charcoal font-sans ${
              smallText ? 'text-sm' : 'font-semibold text-base md:text-lg'
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );

  return variant === 'card' ? cardVariant : inlineVariant;
};

export function HabitCardListSkeleton() {
  const length = 10;

  return Array.from({ length }, (_, i) => (
    <>
      <div className="flex items-center" key={i}>
        <div className="habit-card__img-wrapper flex items-center justify-center overflow-hidden rounded-full mr-6 relative">
          <div className="loading-colors w-full h-full absolute pin-t pin-l" />
        </div>
        <div style={{ gap: '16px' }} className="flex flex-col flex-auto">
          <div className="rounded-2lg loading-colors w-full h-12" />
          <div className="w-24 rounded-2lg h-6 loading-colors" />
        </div>
      </div>
      {i < length - 1 && <div className="h-px w-full bg-gray-dark my-8" />}
    </>
  ));
}

export default HabitCard;
