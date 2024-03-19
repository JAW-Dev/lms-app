import React, { useState } from 'react';
// Components
import ContentSidebar from './ContentSidebar';
import ContentBody from './ContentBody';
import ContetnWrapperElement from './ContetnWrapperElement';
import ContentInner from './ContentInner';
import CollapsButton from '../CollapsButton';
// Helpers
import GetElemetsDimensions from '../../helpers/getElemetsDimensions';


import { useSideBarContent } from '../../context/SidebarContext';

/**
 * Content Wrapper component responsible for rendering the main content area.
 * @param {Object} props - The props for the ContentWrapper component.
 * @param {Object} props.options - The options for the ContentWrapper component.
 * @param {string} props.options.layout - The layout of the content wrapper ('right', 'left', or 'full').
 * @param {boolean} props.options.showCollaosButton - Flag indicating whether to show the collapse button.
 * @returns {JSX.Element} - The rendered ContentWrapper component.
 */
const ContentWrapper = ({ options }) => {
  const {
    layout = 'right',
    showCollaosButton = false
  } = options;

  let elements = '';
  options.dimmensions = GetElemetsDimensions();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { sidebarHeight } = useSideBarContent();

  /**
   * Handles the collapse action of the sidebar.
   */
  const handleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  options.isSidebarCollapsed = isSidebarCollapsed;
  options.handleCollapse = handleCollapse;
  options.sidebarHeight = sidebarHeight > options.dimmensions.sidebarHeight ? sidebarHeight : options.dimmensions.sidebarHeight;

  switch (layout) {
    case 'right':
      elements = (<><ContentSidebar options={options} /><ContentBody options={options} /></>);
      break;
    case 'left':
      elements = (<><ContentBody options={options} /><ContentSidebar options={options} /></>);
      break;
    case 'full':
      elements = (<><ContentBody options={options} /></>);
      break;
    default:
      elements = (<><ContentSidebar options={options} /><ContentBody options={options} /></>);
  }

  return (
    <ContetnWrapperElement options={options}>
      <ContentInner options={options}>
        {elements}
        {(layout !== 'full' && showCollaosButton) && <CollapsButton options={options} />}
      </ContentInner>
    </ContetnWrapperElement>
  );
};

export default ContentWrapper;
