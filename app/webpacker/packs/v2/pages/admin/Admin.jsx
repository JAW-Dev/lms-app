import React, { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import SVG from 'react-inlinesvg';

import useAuth from '../../context/AuthContext';
import { adminMenu } from '../../helpers/localData';

const AdminSideBarMenu = () => {
  const { pathname } = useLocation();

  return (
    <div
      style={{
        padding: '132px 16px 16px calc(100vw * 0.05)',
        gap: '16px',
        marginTop: '-100px',
        minHeight: 'calc(100vh + 100px)',
        width: '318px'
      }}
      className="flex flex-col bg-faint-charcoal fixed pin-l border-r border-gray "
    >
      <h2 className="pb-4 pt-12" style={{ fontSize: "24px", fontWeight: "700" }}>
        Admin
      </h2>
      {adminMenu.map((item) => {
        const { route, text, icon, disabled } = item;
        return (
          !disabled && (
            <Link
              className={` font-bold py-2 px-4 -ml-4 rounded flex items-center ${
                pathname.includes(route)
                  ? 'bg-purple-100 text-link-purple'
                  : 'bg-white text-charcoal hover:bg-purple-100'
              }`}
              key={crypto.randomUUID()}
              to={route}
              style={{borderRadius: '12px'}}
            >
              <SVG
                src={icon}
                className={`mr-2 ${
                  pathname === route && 'admin-sidebar-menu-svg--active'
                }`}
              />
              {text}
            </Link>
          )
        );
      })}
    </div>
  );
};

export default function Admin() {
  const { userData, isEmployee } = useAuth();
  const isAdmin = userData?.roles?.includes('admin');
  const hasAccess = isAdmin || isEmployee;

  const navigate = useNavigate();

  if (!hasAccess) {
    navigate('/v2');
  }

  return (
    <div className="flex relative">
      {hasAccess && (
        <AdminSideBarMenu />
      )}
      <div
        style={{
          padding: '32px calc(100vw * 0.05) 150px calc(100vw * 0.05 + 328px)',
        }}
        className="admin-user flex-auto"
      >
        <Outlet />
      </div>
    </div>
  );
}
