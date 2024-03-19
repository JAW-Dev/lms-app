import React from 'react';
import useResponsive from '../../../hooks/useResponsive';


const SidebarMenu = ({ children, version = '1', ...rest }) => {
  const { isTablet } = useResponsive();

  const styles = {
    paddingLeft: !isTablet && 'calc(100vw * 0.05)',
    paddingTop: '130px',
    paddingBottom: '60px',
    width: !isTablet ? '550px' : '100%',
    maxWidth: !isTablet ? '550px' : '100%',
    minHeight: !isTablet && 'calc(100vh - 98px)'
  };
  let classes = 'px-4 lg:pr-6 lg:fixed pin-t pin-l h-full lg:border-r border-gray-dark overflow-y-auto';

  if (version === '2') {
    classes = `${classes} bg-white-faint`;
  }

  return (
    <div
      style={styles}
      className={classes}
      {...rest}
    >
      {children}
    </div>
  );
};

export default SidebarMenu;
