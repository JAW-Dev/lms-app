import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import Container from './Container';
import DropdownMenu, { MenuItem } from './DropdownMenu';
import OutsideDetector from '../hooks/outsideDetector';
import useResponsive from '../hooks/useResponsive';
import useStopScrolling from '../hooks/useStopScrolling';

import LogoIcon from '../../../../assets/images/reskin-images/logo--cra-reversed.svg';
import LeftChevron from '../../../../assets/images/reskin-images/icon--chevron-left.svg';
import XIcon from '../../../../assets/images/reskin-images/icon--x.svg';

import IconXBlack from '../../../../assets/images/reskin-images/icon--x-black.svg';

import { hamburgerDropdownList, userDropdownList } from '../helpers/localData';
import useScrollDirection from '../hooks/useScrollDirection';
import useAuth from '../context/AuthContext';
import { useSlideContent } from '../context/SlideContent';
import { useSideBarContent } from '../context/SidebarContext';

import Button from './Button';

const HamburgerMenu = ({ className, setSlideMobileMenu }) => {
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);
  const { isMobile } = useResponsive();

  const onClick = () => {
    if (isMobile) {
      setSlideMobileMenu(true);
    } else {
      setShowLinkDropdown(!showLinkDropdown);
    }
  };

  return (
    <OutsideDetector
      className={` ${className} relative`}
      stateSetter={setShowLinkDropdown}
    >
      <button
        type="button"
        className="h-9 w-9 flex justify-center items-center"
        onClick={() => onClick()}
      >
        {!showLinkDropdown ? (
          <div className="h-4 flex flex-col justify-between px-3">
            <span style={{ height: '2px' }} className="w-5 rounded bg-black" />
            <span style={{ height: '2px' }} className="w-5 rounded bg-black" />
            <span style={{ height: '2px' }} className="w-5 rounded bg-black" />
          </div>
        ) : (
          <div
            style={{
              boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.2)',
              borderRadius: '0.75rem',
            }}
            className="h-10 w-10 flex justify-center items-center bg-white"
          >
            <SVG src={XIcon} alt="X icon" />
          </div>
        )}
      </button>
      {showLinkDropdown && (
        <DropdownMenu
          style={{ right: '24px', maxHeight: 'calc(100vh - 90px)', overflowY: 'scroll' }}
          className="mt-3"
          list={hamburgerDropdownList}
        />
      )}
    </OutsideDetector>
  );
};

const UserMenu = ({ userProfile }) => {
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);
  const { userData } = useAuth();
  const blankPicture = userData?.profile?.avatar?.url?.includes('blank');

  return (
    <OutsideDetector
      className="relative hidden md:block"
      stateSetter={setShowLinkDropdown}
    >
      <button
        type="button"
        className={`p-2 rounded-2lg ml-4 ${
          showLinkDropdown && 'bg-purple-500'
        }`}
        onClick={() => setShowLinkDropdown(!showLinkDropdown)}
      >
        <div className="h-6 w-6 rounded-lg flex justify-center items-center bg-white overflow-hidden">
          {blankPicture ? (
            userData?.profile?.first_name?.charAt(0)
          ) : (
            <img src={userData?.profile?.avatar?.url} />
          )}
        </div>
      </button>
      {showLinkDropdown && (
        <DropdownMenu className="mt-3 pin-r" list={userDropdownList} />
      )}
    </OutsideDetector>
  );
};

const MobileMenu = ({backButtonClick}) => {
  return (
    <button
      type="button"
      style={{
        minHeight: '36px',
        minWidth: '36px',
      }}
      onClick={backButtonClick}
      className="flex items-center justify-center bg-grey-lighter rounded-full mr-2"
    >
      <SVG src={LeftChevron} />
    </button>
  )
}

const HelpToHabitMobileNav = () => {
  return (
    <NavLink
      type="button"
      style={{
        minHeight: '36px',
        minWidth: '36px',
      }}
      to="/v2/help-to-habit"
      className="flex items-center justify-center bg-grey-lighter rounded-full mr-2"
    >
      <SVG src={LeftChevron} />
    </NavLink>
  )
}

const HeaderLogoIcon = ({isMobile}) => {
  return (
    <a href="/">
      <img
        style={{
          maxHeight: isMobile ? '36px' : '38px',
        }}
        src={LogoIcon}
        alt="Admired Leadership Logo"
        className="-mb-2"
      />
    </a>
  )
}

const Header = ({}) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  const { userData, isCarneyTeam, isEmployee } = useAuth();
  const { pathname } = useLocation();
  const { isMobile, isTablet } = useResponsive();
  const [openHeader, setOpenHeader] = useState(true);
  const [slideMobileMenu, setSlideMobileMenu] = useState(false);
  const { slideContent, setSlideContent } = useSlideContent();
  const { showContentMobile, setShowContentMobile } = useSideBarContent();
  const isAdmin = userData?.roles?.includes('admin');

  const updateHeaderHeight = () => {
    if (headerRef?.current) {
      setHeaderHeight(headerRef?.current?.clientHeight);
    }
  };

  useLayoutEffect(() => {
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    if (isTablet) {
      setOpenHeader(true);
    }
  }, [isTablet]);

  useStopScrolling(slideMobileMenu);

  const backButtonClick = () => {
    setSlideContent(false);
    setShowContentMobile(false);
  };

  const isHelpToHabitContentPage =
    pathname.startsWith('/v2/help-to-habit/') &&
    pathname !== '/v2/help-to-habit';

  const isUsersAccessPage = pathname.startsWith('/v2/users/access');

  const isFreeAccount = userData?.profile?.hubspot?.access_type === '5 Free Videos';

  return (
    <>
      <div style={{height: headerHeight}} className="header-spacer"/>
      <header
        style={{
          position: 'fixed',
          zIndex: '999',
          transition: '0.1s all linear',
          top: openHeader ? '0' : `-${headerHeight}px`,
        }}
        ref={headerRef}
        className="relative pin-l z-50 w-full"
        id="v2-header"
      >
        <Container borderBottom className="full-screen-container my-3 lg:my-6 flex items-center">
          {slideContent || showContentMobile ? (<MobileMenu backButtonClick={backButtonClick}/>) : null}
          {isHelpToHabitContentPage && isTablet ? (<HelpToHabitMobileNav/>) : null}
          <HeaderLogoIcon isMobile={isMobile}/>

          {(!isUsersAccessPage && userData) ? (
            <>
              {isFreeAccount && (
                <a href="/program/orders/new" className="ml-auto text-link-purple font-bold" style={{ fontSize: '14px' }}>
                  Get Full Access
                </a>
              )}
              <HamburgerMenu setSlideMobileMenu={setSlideMobileMenu} className={isFreeAccount ? 'ml-8' : 'ml-auto'}/>
              <UserMenu />
            </>

          ) : (
            <div className="flex items-center ml-auto" style={{gap: '36px'}}>
              <p className="hide-label font-bold" style={{fontSize: '14px'}}><a href="/users/access" className="font-bold" style={{color: '#3C3C3C'}}>Get Full Access</a></p>
              <Button href="/users/sign_in" variant="default-lowercase" className="font-bold" style={{ borderRadius: '16px' }}>Log In</Button>
            </div>
          )}
        </Container>
      </header>

      {userData && (
        <div
          className={`mobile-menu mobile-menu--${
            slideMobileMenu && 'show'
          } flex w-full h-full fixed md:hidden bg-white`}
        >
          <div className="mobile-menu__inner relative flex flex-col h-full justify-between w-full pt-3 pb-10">
            <div className="flex items-center justify-between w-full px-4">
              <a href="/">
                <img
                  style={{ maxHeight: '28px' }}
                  src={LogoIcon}
                  alt="Admired Leadership Logo"
                />
              </a>
              <button
                style={{
                  height: '48px',
                  width: '48px',
                  top: '16px',
                  right: '16px',
                }}
                type="button"
                className="flex items-center justify-center bg-grey-lighter rounded-full"
                onClick={() => setSlideMobileMenu(false)}
              >
                <SVG src={IconXBlack} />
              </button>
            </div>

            <nav className="flex flex-col w-full" style={{overflow: 'auto'}}>
              {hamburgerDropdownList.map((item, pos) => {
                if (item.text === 'Admin Dashboard' && (isEmployee && !isAdmin)) {
                  item.text = "Invite Users";
                  item.path = "/admin/invites/new";
                }
                
                if ((item.text === 'Admin Dashboard' || item.text === 'Old Admin Dashboard') && !isAdmin) {
                  return;
                }
                
                return (
                  <MenuItem key={crypto.randomUUID()} data={item} pos={pos} />
                );
              })}
            </nav>
            <div className="">
              {userDropdownList.map((item, pos) => (
                <MenuItem key={crypto.randomUUID()} data={item} pos={pos} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
