import React from 'react';

export default function Spinner() {
  return (
    <div
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
      className="w-full h-full z-10 absolute pin-t pin-l flex items-center justify-center"
    >
      <div className="spinner">
        <div className="lds-roller">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </div>
  );
}
