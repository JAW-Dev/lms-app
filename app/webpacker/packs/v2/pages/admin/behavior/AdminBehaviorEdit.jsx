import classNames from 'classnames';
import React from 'react';
import {
  NavLink,
  Outlet,
  useParams,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useQuery } from 'react-query';
import { adminAPI } from '../../../api';
import useAuth from '../../../context/AuthContext';

export default function AdminBehaviorEdit() {
  const { id: behaviorID } = useParams();
  const { pathname } = useLocation();

  const adminBehaviorMenuItems = [
    // {
    //   path: `/v2/admin/behaviors/edit/${behaviorID}`,
    //   label: 'General',
    // },
    // {
    //   path: `/v2/admin/behaviors/edit/${behaviorID}/behavior-map`,
    //   label: 'Behavior Map',
    // },
    // {
    //   path: `/v2/admin/behaviors/edit/${behaviorID}/examples`,
    //   label: 'Examples',
    // },
    // {
    //   path: `/v2/admin/behaviors/edit/${behaviorID}/exercises`,
    //   label: 'Exercises',
    // },
    // {
    //   path: `/v2/admin/behaviors/edit/${behaviorID}/questions`,
    //   label: 'Questions',
    // },
    {
      path: `/v2/admin/behaviors/edit/${behaviorID}/help-to-habit`,
      label: 'Help To Habit',
    },
  ];

  const { data: behavior, isLoading } = useQuery(
    [`behavior ${behaviorID}`],
    () => adminAPI.getBehavior({ behaviorID })
  );

  return (
    <div className="">
      <h1>Edit Behavior</h1>
      <h2 className="font-medium mb-12">{behavior?.title}</h2>
      <div className="flex mb-4">
        {adminBehaviorMenuItems.map((i) => (
          <NavLink
            key={i.path}
            to={i.path}
            className={classNames('px-2 py-2 border-b-2 text-charcoal', {
              'border-black': i.path === pathname,
            })}
          >
            {i.label}
          </NavLink>
        ))}
      </div>
      <Outlet context={behavior} />
    </div>
  );
}
