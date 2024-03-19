import React from 'react';
import Text from '../../Text';

const SidebarMenuHeader = ({ children, ...rest }) => (
  <Text size="h2" variant="h2" className="mb-10 xl:mb-24" {...rest}>
    {children}
  </Text>
);

export default SidebarMenuHeader;
