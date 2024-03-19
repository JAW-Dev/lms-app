import React from 'react';
import useResponsive from '../../hooks/useResponsive';
// Helpers
import GetAttribute from '../../helpers/getAttribute';
// Context
import { useSideBarContent } from '../../context/SidebarContext';

/**
 * Content Body component responsible for rendering the main content area.
 * @param {Object} props - The props for the ContentBody component.
 * @param {Object} props.options - The options for the ContentBody component.
 * @param {React.ReactNode} props.options.content - The content to be rendered in the content body.
 * @param {string} props.options.layout - The layout of the content body ('right', 'left', or 'full').
 * @param {string} props.options.sidebarWidth - The width of the sidebar.
 * @param {string} props.options.contentClasses - Additional CSS classes for the content body.
 * @param {boolean} props.options.contentDefaultClasses - Flag indicating whether to include default CSS classes for the content body.
 * @param {Object} props.options.contentStyle - Additional inline styles for the content body.
 * @param {boolean} props.options.contentDefaultStyles - Flag indicating whether to include default inline styles for the content body.
 * @param {Object} props.options.dimmensions - The dimensions of various elements.
 * @param {string} props.options.baseURL - The base URL for the content body.
 * @param {boolean} props.options.isSidebarCollapsed - Flag indicating whether the sidebar is collapsed.
 * @returns {JSX.Element} - The rendered ContentBody component.
 */
const ContentBody = ({ options }) => {
  const {
    content = '',
    layout = 'right',
    sidebarWidth = '450',
    contentClasses = '',
    contentDefaultClasses = true,
    contentStyle = {},
    contentDefaultStyles = true,
    dimmensions = {},
    baseURL = '',
    isSidebarCollapsed = false,
    isMenu = false
  } = options;

  const { isTablet } = useResponsive();
  const { showContentMobile } = useSideBarContent();
  let defaultClasses = contentDefaultClasses ? 'content-body w-full' : '';
  let layoutStyles = { minHeight: dimmensions.contentHeightMin };

  if (isTablet && isMenu) {
    defaultClasses = 'content-body absolute w-full';
  }

  let padding = 'p-8 pt-16';
  if (isTablet) {
    padding = 'p-4 pt-8';
  }

  let fullClasses = 'relative';

  switch (layout) {
    case 'right':
      layoutStyles = { ...layoutStyles, marginLeft: isSidebarCollapsed ? '100px' : `${sidebarWidth}px` };
      if (showContentMobile) {
        layoutStyles = { ...layoutStyles, minHeight: 'none', marginLeft: '0' };
        defaultClasses = `${defaultClasses} border-t border-gray`;
      }
      break;
    case 'left':
      layoutStyles = { ...layoutStyles, marginRight: isSidebarCollapsed ? '100px' : `${sidebarWidth}px` };
      if (isTablet) {
        layoutStyles = { ...layoutStyles, minHeight: 'none', marginRight: '0' };
        defaultClasses = `${defaultClasses}`;
      }
      break;
    case 'full':
      layoutStyles = { ...layoutStyles, left: '0', margin: '0' };
      if (isTablet) {
        fullClasses = 'relative';
      }
      defaultClasses = `${defaultClasses} ${fullClasses}`;
      break;
    default:
      layoutStyles = { ...layoutStyles, marginLeft: isSidebarCollapsed ? '0' : `${sidebarWidth}px` };
  }

  let defaultstyles = contentDefaultStyles ? layoutStyles : '';

  if (isMenu) {
    let menuClasses = 'relative';
    if (isTablet) {
      defaultstyles = { ...defaultstyles, right: '-110%', transition: 'right 0.3s ease' };
      menuClasses = 'absolute';
    }
    if (showContentMobile) {
      defaultstyles = { ...defaultstyles, right: '0', transition: 'right 0.3s ease' };
    }
    defaultClasses = `${defaultClasses} ${menuClasses}`;
  }

  return (
    <div id="content-body" className={`${defaultClasses} ${GetAttribute(contentClasses)} ${padding}`} style={{ ...defaultstyles, ...contentStyle }}>
      {content}
    </div>
  );
};

export default ContentBody;
