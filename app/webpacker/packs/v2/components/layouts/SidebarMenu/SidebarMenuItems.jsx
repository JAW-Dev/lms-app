import React from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import { useSideBarContent } from './../../../context/SidebarContext';
import useResponsive from '../../../hooks/useResponsive';

const SidebarMenuItems = ({ menuItems, divClasses, divStyles, spanClasses, spanStyles, version = '1', ...rest }) => {
  const isActiveRoute = (route) => {
    const isActive = useMatch(route);
    return isActive;
  };
  const { setShowContentMobile } = useSideBarContent();
  const { isTablet, isMobile } = useResponsive();

  // Default styles and classes
  const itemClasses = 'flex items-center w-full p-3 border-2';
  let itemStyles = { borderRadius: '32px', boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.1)' };
  let itemActiveStyles = { borderRadius: '32px', boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.1)' };
  const itemActive = 'bg-lightest-purple border-purple-500';
  let itemNotActive = 'bg-white border-transparent';
  let wrapperStyles = { gap: '24px' };
  let wrapperClasses = 'flex flex-col relative';
  let subElementClasses = 'ml-4 text-charcoal text font-semibold';
  let subElementStyles = {};

  if (divStyles) {
    wrapperStyles = divStyles;
  }

  if (divClasses) {
    wrapperClasses = divClasses;
  }

  if (spanClasses) {
    subElementClasses = spanClasses;
  }

  if (spanStyles) {
    subElementStyles = spanStyles;
  }

  if (version === '2') {
    itemStyles = { borderRadius: '12px', borderColor: 'white' };
    itemNotActive = 'bg-white';
    itemActiveStyles = { borderRadius: '12px', borderColor: '#f3f2fb' };
  }

  const clickHandler = () => {
    if (isTablet) {
      setShowContentMobile(true)
    }
  }

  return (
    <>
      <div style={wrapperStyles} className={wrapperClasses} {...rest}>
        {menuItems.map((menuItem) => {
          const { icon, activeIcon, text, route } = menuItem;
          const isActive = isActiveRoute(route);
          const classes = `${itemClasses} ${(isActive ? itemActive : itemNotActive)}`;
          return (
            <NavLink
              style={isActive ? itemActiveStyles : itemStyles}
              key={crypto.randomUUID()}
              to={route}
              className={classes}
              onClick={() => clickHandler()}
            >
              <SVG src={isActive ? activeIcon : icon} />
              <span className={subElementClasses} style={subElementStyles}>
                {text}
              </span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default SidebarMenuItems;
