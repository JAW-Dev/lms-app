import React, { useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Header from './Header';
import Alarm from './Alarm';
import Modal from './Modal';
import Footer from './Footer';
import Overlay from './Overlay';
import { useOverlay } from '../context/OverlayContext';
import useResponsive from './../hooks/useResponsive';

export default function Root() {
  const ref = useRef();
  const { isTablet } = useResponsive();
  const { pathname } = useLocation();
  const { overlay} = useOverlay();

  return (
    <>
      <div
        ref={ref}
        style={{ minHeight: '100vh' }}
        className="overflow-x-hidden relative"
      >
        <Alarm />
        <Modal />
        <Header />
        <Outlet />
        {(overlay && !isTablet) && (
          <Overlay className={`${overlay ? 'show' : 'hide'}`}/>
        )}
        {!pathname.includes('program') &&
          !pathname.includes('help-to-habit') &&
          !pathname.includes('admin') &&
          !pathname.includes('users') &&
          !pathname.includes('phone-verification') && <Footer />}
          {pathname.startsWith('/v2/users/access') && <Footer />}
      </div>
    </>
  );
}
