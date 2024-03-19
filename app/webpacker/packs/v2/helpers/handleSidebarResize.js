const handleSidebarResize = (callback) => {
  const header = document.querySelector('header');
  let footer = document.querySelector('footer');
  const content = document.getElementById('content-body');
  const viewportHeight = window.innerHeight;

  if (!footer) {
    footer = '<div></div>';
  }

  if (header && footer && content && viewportHeight) {
    const headerHeight = header.offsetHeight;
    const footerHeight = footer.offsetHeight;
    const getOffsetHeight = viewportHeight - (headerHeight + footerHeight);
    const contentHeight = content.offsetHeight;
    const newSidebarHeight = getOffsetHeight > contentHeight ? getOffsetHeight : contentHeight;

    if (typeof callback === 'function') {
      callback(newSidebarHeight);
    } else {
      return newSidebarHeight;
    }
  }
};

export default handleSidebarResize;
