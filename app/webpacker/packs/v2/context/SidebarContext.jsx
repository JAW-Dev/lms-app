import React, { createContext, useContext, useState, useEffect } from 'react';
import handleSidebarResize from '../helpers/handleSidebarResize';

const SidebarContext = createContext();

export const useSideBarContent = () => useContext(SidebarContext);

export const SideBarContentProvider = ({ children }) => {
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const [showContentMobile, setShowContentMobile] = useState(false);

  useEffect(() => {
    handleSidebarResize(setSidebarHeight);

    window.addEventListener('resize', handleSidebarResize(setSidebarHeight));

    return () => {
      window.removeEventListener('resize', handleSidebarResize(setSidebarHeight));
    };
  }, []); // Add updateSidebarHeight as a dependency

  return (
    <SidebarContext.Provider value={{ sidebarHeight, setSidebarHeight, showContentMobile, setShowContentMobile }}>
      {children}
    </SidebarContext.Provider>
  );
};
