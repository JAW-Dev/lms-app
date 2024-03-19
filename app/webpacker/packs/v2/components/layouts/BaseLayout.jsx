import React from 'react';

const BaseLayout = ({ children, ...rest }) => (
  <div {...rest}>
    {children}
  </div>
);

export default BaseLayout;
