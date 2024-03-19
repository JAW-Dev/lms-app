import React, { useState, useEffect } from 'react';
import useResponsive from '../../../hooks/useResponsive';

/**
 * Component representing the menu sidebar.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to render inside the sidebar.
 * @param {string} props.className - Additional CSS classes for the sidebar.
 * @param {object} props.style - Additional inline styles for the sidebar.
 * @returns {React.ReactNode} The rendered menu sidebar component.
 */
const SidebarMenuNotes = ({ children, className, style, side = 'right', ...rest }) => {
  const { isTablet } = useResponsive();

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const headerElement = document.querySelector('.site-header');

    if (headerElement) {
      setHeaderHeight(headerElement.clientHeight);
    }
  }, []);

  let elementStyle = {
    paddingLeft: !isTablet && 'calc(100vw * 0.05)',
    paddingTop: '2rem',
    width: !isTablet && '550px',
    maxWidth: !isTablet && '550px',
    minWidth: !isTablet && '550px',
    minHeight: `calc(100vh - ${headerHeight}px)`,
    maxHeight: `calc(100vh - ${headerHeight}px)`,
    ...style
  };

  if (side === 'left') {
    elementStyle = {
      paddingRight: !isTablet && 'calc(100vw * 0.05)',
      paddingTop: '2rem',
      width: !isTablet && '550px',
      maxWidth: !isTablet && '550px',
      minWidth: !isTablet && '550px',
      minHeight: `calc(100vh - ${headerHeight}px)`,
      maxHeight: `calc(100vh - ${headerHeight}px)`,
      ...style
    };
  }

  return (
    <div
      style={elementStyle}
      className={`bg-white-faint px-4 lg:pr-6 sticky pin-t pin-l h-full lg:border-r border-gray-dark lg:overflow-y-auto ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default SidebarMenuNotes;
