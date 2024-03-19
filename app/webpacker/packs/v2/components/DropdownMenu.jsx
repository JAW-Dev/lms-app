import React, { useState, useRef, useContext, useEffect } from 'react';
import SVG from 'react-inlinesvg';
import useAuth from '../context/AuthContext';

export const MenuItem = ({ data, pos, excluded }) => {
  const { icon, text, path, onClick, subList } = data;
  const isCurrentPage = window.location.pathname === path;
  const [collapse, setCollapse] = useState(true);
  const collapsibleRef = useRef();
  const collapsibleMenuHeight =
    collapsibleRef &&
    collapsibleRef.current &&
    collapsibleRef.current.scrollHeight;

  const El = path ? 'a' : 'div';

  const onClickHandler = () => {
    if (onClick) {
      onClick();
    }
    if (subList.length) {
      setCollapse(!collapse);
    }
  };

  return (
    <div
      style={{ minWidth: '268px' }}
      className={`${pos !== 'last' && 'border-b border-grey-lighter'}`}
    >
      <El
        href={path && path}
        onClick={() => onClickHandler()}
        className={`p-3 flex items-center cursor-pointer text-left bg-white ${
          text === 'Dashboard' ? 'dashboard-menu-hover' : 'menu-hover'
        } ${
          isCurrentPage && text === 'Dashboard' && 'dashboard-current-menu'
        } ${isCurrentPage && text !== 'Dashboard' && 'current-menu'} 
        ${!icon && 'hover:bg-purple-lightest'}
        `}
      >
        {icon && (
          <div
            style={{
              borderRadius: '12px',
              minWidth: '36px',
              minHeight: '36px',
            }}
            className={`w-8 h-8 flex justify-center items-center menu-icon-bg ${
              isCurrentPage ? 'bg-purple-500' : 'bg-grey-lighter'
            }`}
          >
            {icon && <SVG src={icon} alt="icon" />}
          </div>
        )}
        <h3 className="ml-4 text-sm font-bold text-charcoal whitespace-no-wrap">
          {text}
        </h3>
      </El>
      {/* Collapsible Menu */}
      {subList.length !== 0 && (
        <div
          ref={collapsibleRef}
          style={{ height: collapsibleMenuHeight }}
          className={` flex flex-col ${
            !collapse ? 'show-collapsible-menu' : 'hide-collapsible-menu'
          }`}
        >
          {subList.map((item) => {
            if (item.text === 'Get Podcast Link' && excluded) {
              return null; // Return null or any other element to skip rendering
            }

            return (
              <a
                key={item.path}
                className="px-4 sub-menu-hover"
                href={item.path}
              >
                <p className="py-3 ml-16 font-sans text-black border-t border-grey-lighter">
                  {item.text}
                </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DropdownMenu = ({ list, className, style }) => {
  const [excluded, setExcluded ] = useState(false);
  const { userData, isCarneyTeam, isEmployee } = useAuth();
  const isAdmin = userData?.roles?.includes('admin');

  const excludes = [
    'Week Access',
    'N/A',
    'EXPIRED Full Access',
    '5 Free Videos',
    'EXPIRED Corporate Access',
    'EXPIRED Annual Access',
    'EXPIRED Ambassador Access',
    'EXPIRED Renewal',
    'EXPIRED Employee Access',
    '',
    '12 Hour Access'
  ];

  useEffect(() => {
    const accessType = userData?.profile?.hubspot?.access_type;

    if (excludes.includes(accessType)) {
      setExcluded(true);
    }
  }), [userData];

  return (
    list && (
      <div
        style={{
          boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.2)',
          zIndex: 999,
          ...style,
        }}
        className={`absolute bg-white rounded-2lg overflow-hidden ${className}`}
      >
        {userData &&
          list.map((item, index) => {
            const pos = index === 0 ? 'first' : index === list.length - 1 ? 'last' : null;

            if (item.text === 'Admin Dashboard' && (isEmployee && !isAdmin)) {
              item.text = "Invite Users";
              item.path = "/admin/invites/new";
            }

            if ((item.text === 'Admin Dashboard' || item.text === 'Old Admin Dashboard') && !isAdmin) {
              return;
            }

            return <MenuItem key={item.text} data={item} pos={pos} excluded={excluded}/>;
          })}
      </div>
    )
  );
};

export default DropdownMenu;
