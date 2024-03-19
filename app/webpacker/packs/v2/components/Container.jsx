import React from 'react';

const Container = ({
  className,
  borderBottom,
  children,
  containerize,
  parentClassName,
  style,
}) => {
  return (
    <div
      className={`bg-white-faint w-full flex justify-center ${parentClassName}
      ${borderBottom && 'border-b border-gray-light'}
        `}
    >
      <div
        style={{ ...style }}
        className={`w-full ${containerize && 'container'} ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
