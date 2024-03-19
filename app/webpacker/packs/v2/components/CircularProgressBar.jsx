/* eslint-disable */

import React from 'react';

const CircularProgressBar = ({ strokeWidth, percentage }) => {
  const radius = 16 - strokeWidth / 2;
  const pathDescription = `
      M 25,25 m 0,-${radius}
      a ${radius},${radius} 0 1 1 0,${2 * radius}
      a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `;

  const diameter = Math.PI * 2 * radius;
  const progressStyle = {
    stroke: '#A7C400',
    strokeLinecap: 'round',
    strokeDasharray: `${diameter}px ${diameter}px`,
    strokeDashoffset: `${((100 - percentage) / 100) * diameter}px`
  };

  return (
    <svg className={'CircularProgressbar'} viewBox="0 0 50 50" width={50} height={50}>
      <path
        className="CircularProgressbar-trail"
        d={pathDescription}
        strokeWidth={strokeWidth}
        fillOpacity={0}
        style={{
          stroke: '#d6d6d6'
        }}
      />

      <path
        className="CircularProgressbar-path"
        d={pathDescription}
        strokeWidth={strokeWidth}
        fillOpacity={0}
        style={progressStyle}
      />
    </svg>
  );
};

export default CircularProgressBar;
