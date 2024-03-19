import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, user }) => (
  <div className="overflow-x-hidden relative">
    <Header user={user} /> {children}
  </div>
);

export default Layout;
