import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import icons from '../../utils/icons';
import SidebarMenuItems from '../../components/layouts/SidebarMenu/SidebarMenuItems';
import { useSideBarContent } from '../../context/SidebarContext';
import useStopScrolling from '../../hooks/useStopScrolling';
import Main from '../../components/layouts/Main';
import useAuth from '../../context/AuthContext';
import useResponsive from '../../hooks/useResponsive';

function UserProfileMenu() {
  const menuItems = [
    {
      icon: icons.userCircle,
      activeIcon: icons.userCircleActive,
      text: 'Manage Profile',
      route: '/v2/users/profile/manage-profile'
    },
    {
      icon: icons.shieldKeyHole,
      activeIcon: icons.shieldKeyHoleActive,
      text: 'Manage Account',
      route: '/v2/users/profile/manage-account'
    },
    {
      icon: icons.caseIcon,
      activeIcon: icons.caseIconActive,
      text: 'Subscription',
      route: '/v2/users/profile/subscription-settings'
    }
  ];
  return (
    <div className="w-full py-8 lg:p-0">
      <div className="flex justify-between items-center">
        <h1 className="text-charcoal font-bold px-8 lg:px-0 text-2xl">
          Settings
        </h1>
      </div>
      <div className="flex flex-col pt-10">
        <SidebarMenuItems menuItems={menuItems} version="2" />
      </div>
    </div>
  );
}

export default function UserProfile() {
  const { isTablet } = useResponsive();
  const location = useLocation();
  const [isOutletVisible, setIsOutletVisible] = useState(false);
  const { showContentMobile } = useSideBarContent();

  useStopScrolling(showContentMobile);

  useEffect(() => {
    setIsOutletVisible(location.pathname !== '/v2/users/profile');
  }, [location]);

  const options = {
    content: <Outlet />,
    sidebar: <UserProfileMenu />,
    sidebarClasses: 'lg:border-r lg:border-gray bg-white-faint',
    contentClasses: 'bg-white py-8 flex justify-center ',
    isOutletVisible,
    isMenu: true
  };

  return <Main options={options} />;
}
