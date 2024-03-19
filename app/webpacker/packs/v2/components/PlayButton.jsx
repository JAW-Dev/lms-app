import React from 'react';
import PlayButtonIcon from '../../../../assets/images/reskin-images/icon--playbutton.svg';

const PlayButton = ({ className, style, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{ ...style }}
      className={`play-button absolute rounded-full bg-white ${className}`}
    >
      <img src={PlayButtonIcon} alt="Play Button Icon" />
    </button>
  );
};

export default PlayButton;
