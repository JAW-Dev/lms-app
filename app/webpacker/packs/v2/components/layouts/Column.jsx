import React from 'react';

function Column({ children, ...rest }) {
  return (
    <div {...rest}>
      {children}
    </div>
  );
}

export default Column;
