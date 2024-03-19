import { useState, useEffect } from 'react';

/**
 * Custom hook to get various dimensions of elements in a React component.
 * @returns {{
 *    headerHeight: number,
 *    footerHeight: number,
 *    offsetHeight: number,
 *    contentHeight: number,
 *    contentHeightMin: number,
 *    sidebarHeight: number,
 *    buttonWidth: number,
 *    hasOverflowScroll: number
 * }}
 */
const GetElemetsDimensions = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [offsetHeight, setOffsetHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [contentHeightMin, setContentHeightMin] = useState(0);
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const [buttonWidth, setButtonWidth] = useState(0);
  const [hasOverflowScroll, setHasOverflowScroll] = useState(0);


  useEffect(() => {
    /**
     * Function to handle the resize event and update element dimensions.
     */
    const handleResize = () => {
      const header = document.querySelector('header');
      let footer = document.querySelector('footer');
      const content = document.getElementById('content-body');
      const sidebar = document.getElementById('content-sidebar');
      const button = document.getElementById('collasp-button');
      const viewportHeight = window.innerHeight;

      if (!footer) {
        footer = '<div></div>';
      }

      if (button) {
        setButtonWidth(button.offsetWidth);
      }

      if (header && footer) {
        setHeaderHeight(header.offsetHeight);
        setFooterHeight(footer.offsetHeight);
        setOffsetHeight(headerHeight + footerHeight);
      }
      if (header && footer && content && viewportHeight) {
        const getOffsetHeight = viewportHeight - (header.offsetHeight);
        setContentHeight(content.offsetHeight);
        setContentHeightMin(getOffsetHeight);
        setSidebarHeight(getOffsetHeight > content.offsetHeight ? getOffsetHeight : content.offsetHeight);
      }

      if (sidebar) {
        setHasOverflowScroll(sidebar && sidebar.scrollHeight > sidebar.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    headerHeight,
    footerHeight,
    offsetHeight,
    contentHeight,
    contentHeightMin,
    sidebarHeight,
    buttonWidth,
    hasOverflowScroll
  };
};

export default GetElemetsDimensions;
