import React from 'react';
import useResponsive from '../../hooks/useResponsive';
import GetAttribute from '../../helpers/getAttribute';

/**
 * Content Sidebar component responsible for rendering the sidebar content.
 * @param {Object} props - The props for the ContentSidebar component.
 * @param {Object} props.options - The options for the ContentSidebar component.
 * @param {React.ReactNode} props.options.sidebar - The content to be rendered in the sidebar.
 * @param {string} props.options.layout - The layout of the sidebar ('right' or 'left').
 * @param {string} props.options.sidebarWidth - The width of the sidebar.
 * @param {string} props.options.sidebarClasses - Additional CSS classes for the sidebar.
 * @param {boolean} props.options.sidebarDefaultClasses - Flag indicating whether to include default CSS classes for the sidebar.
 * @param {Object} props.options.sidebarStyle - Additional inline styles for the sidebar.
 * @param {boolean} props.options.sidebarDefaultstyles - Flag indicating whether to include default inline styles for the sidebar.
 * @param {Object} props.options.dimmensions - The dimensions of various elements.
 * @param {boolean} props.options.isSidebarCollapsed - Flag indicating whether the sidebar is collapsed.
 * @returns {JSX.Element} - The rendered ContentSidebar component.
 */
const ContentSidebar = ({ options }) => {
  const {
    sidebar = '',
    layout = 'right',
    sidebarWidth = '450',
    sidebarClasses = '',
    sidebarDefaultClasses = true,
    sidebarStyle = {},
    sidebarDefaultstyles = true,
    isSidebarCollapsed = false,
    sidebarHeight
  } = options;

  const { isTablet, isMobile } = useResponsive();
  let defaultClasses = sidebarDefaultClasses ? 'content-sidebar absolute overflow-hidden overflow-y-auto pin-t p-8 pt-16' : '';
  let layoutStyles = { height: `${sidebarHeight}px`, width: isTablet || isMobile ? '100%' : `${sidebarWidth}px`, transition: 'width 0.1s ease' };

  if (isTablet) {
    layoutStyles = {};
    defaultClasses = 'content-sidebar relative w-full';
  }

  let padding = 'p-8 pt-16';
  if (isTablet) {
    padding = 'p-4 pt-8';
  }

  switch (layout) {
    case 'right':
      defaultClasses = `${defaultClasses} pin-l lg:border-r lg:border-gray`;
      if (isTablet || isMobile) {
        defaultClasses = `${defaultClasses}`;
      }
      break;
    case 'left':
      defaultClasses = `${defaultClasses} pin-r lg:border-l lg:border-gray`;
      if (isTablet || isMobile) {
        defaultClasses = `${defaultClasses} border-t border-gray`;
      }
      break;
    default:
      defaultClasses = `${defaultClasses} pin-l`;
  }

  const defaultstyles = sidebarDefaultstyles ? layoutStyles : '';

  return (
    <div id="content-sidebar" className={`${defaultClasses} ${GetAttribute(sidebarClasses)} ${padding}`} style={{ ...defaultstyles, ...sidebarStyle }}>
      {!isSidebarCollapsed && sidebar}
    </div>
  );
};

export default ContentSidebar;
