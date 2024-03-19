import React from 'react';

const SmallColumnNoBG = ({ children, ...rest }) => (
  <div {...rest}>
    { children }
  </div>
);

export default SmallColumnNoBG;
