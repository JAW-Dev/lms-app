import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
// Packages
import SVG from 'react-inlinesvg';
import SideActionBoard from './SideActionBoard';
//API
import { adminAPI, userAPI } from '../api';
// Helpers
import { convertHubSpotLabel, formatDate } from '../helpers';
// Context
import useAlarm from '../context/AlarmContext';
import useData from '../context/DataContext';
// Coponents
import UserInviteForm from './UserInviteForm';
import FormInput from './FormInput';
import FormLoader from './FormLoader';
import IndependentUserInviteForm from './IndependentUserInviteForm';
// Icons
import ChevronRightIcon from '../../../../assets/images/reskin-images/icon--chevrons-right.svg';
import UnlockedIcon from '../../../../assets/images/reskin-images/icon--unlocked.svg';
import LockedIcon from '../../../../assets/images/reskin-images/icon--locked.svg';
import CheckIcon from '../../../../assets/images/reskin-images/icon--check.svg';

const DisplayView = ({ user, setOpenSideActionBoard, openSideActionBoard }) => (
  user && (
  <>
    <div className="flex justify-between items-center relative pb-4 px-8">
      <button
        className="p-2 flex items-center -ml-2"
        type="button"
        onClick={() => setOpenSideActionBoard()}
      >
        <SVG src={ChevronRightIcon} />
      </button>
      <button
        className="p-4 text-sm font-bold bg-purple-100 rounded-lg hover:bg-purple-200"
        type="button"
        onClick={() =>
          setOpenSideActionBoard({ ...openSideActionBoard, action: 'edit' })
            }
      >
        Edit User
      </button>
      <span
        style={{ width: 'calc(100% + 6rem)' }}
        className="absolute pin-b pin-r -mx-16 h-px bg-gray flex"
      />
    </div>

    <div className="sidebar-table overflow-y-scroll h-full px-8 py-8">
      <h1>
        {user.profile.first_name} {user.profile.last_name}
      </h1>
      <table className="mt-12">
        <h3 className="mb-4">Account Details</h3>
        <tbody>
          <tr>
            <td>Email</td>
            <td>{user.email ? user.email : '---'}</td>
          </tr>
          <tr>
            <td>Invitation sent on</td>
            <td>
              {user.user_invite?.invited_at
                ? formatDate(user.user_invite?.invited_at)
                : '---'}
            </td>
          </tr>
          <tr>
            <td>Invitation expires on</td>
            <td>
              {user.user_invite?.expires_at
                ? formatDate(user.user_invite?.expires_at)
                : '---'}
            </td>
          </tr>
          <tr>
            <td>Signed up on</td>
            <td>
              {user.confirmed_at ? formatDate(user.confirmed_at) : '---'}
            </td>
          </tr>
          <tr>
            <td>Last log in</td>
            <td>
              {user.last_sign_in_at
                ? formatDate(user.last_sign_in_at)
                : '---'}
            </td>
          </tr>
          <tr>
            <td>Email opt-in</td>
            <td>{user.profile?.opt_in ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
      </table>

      {user.hubspot_properties && (
      <table className="mt-12">
        <h3 className="mb-4">HubSpot Properties</h3>
        <tbody>
          {Object.entries(user.hubspot_properties).map(([key, value]) => (
            <tr key={crypto.randomUUID()}>
              <td>{convertHubSpotLabel(key)}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}

      <h3 className="mt-12 mb-8">Modules</h3>
      {user.courses &&
            user.courses.map((course) => {
              const { enrolled_in: enrolledIn, title, behaviors } = course;
              return (
                <>
                  <div className="flex items-center mb-4">
                    {enrolledIn ? (
                      <div className="rounded bg-green-lightest p-2 flex items-center justify-center mr-4">
                        <SVG className="svg-green" src={UnlockedIcon} />
                      </div>
                    ) : (
                      <div className="rounded bg-red-lightest p-2 flex items-center justify-center mr-4">
                        <SVG className="svg-red" src={LockedIcon} />
                      </div>
                    )}
                    <p>{title}</p>
                  </div>
                  {behaviors && (
                    <div
                      style={{ gap: '16px' }}
                      className="ml-4 pl-4 border-l border-gray mb-8 flex flex-col"
                    >
                      {behaviors.map((behavior) => {
                        const { title: behaviorTitle, completed } = behavior;

                        return (
                          <div className="flex items-center">
                            {completed ? (
                              <div className="rounded-full bg-green-lightest flex items-center justify-center p-1 mr-4 -my-2">
                                <SVG className="svg-green" src={CheckIcon} />
                              </div>
                            ) : (
                              <div className="w-8 mr-4" />
                            )}
                            <p>{behaviorTitle}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })}
    </div>
  </>
  )
);

const UserEditForm = ({
  setOpenSideActionBoard,
  openSideActionBoard,
  user
}) => {
  const [formData, setFormData] = useState(
    user
      ? {
        id: user.id,
        first_name: user.profile?.first_name,
        last_name: user.profile?.last_name,
        email: user.email,
        company_name: user.profile?.company_name,
        user_invite: user.user_invite
          ? {
            access_type: user.profile?.hubspot?.access_type,
            id: user.user_invite.id,
            expires_at: user.user_invite.expires_at,
            unlimited_gifting: user.roles.includes('unlimited_gifts'),
            invitation_access: user.user_invite.access_type,
            skip_email: true,
            course_ids: user.courses,
            valid_for_days: user.user_invite.valid_for_days,
            expiration_type: user.user_invite.expiration_type,
            length_type: user.user_invite.length_type,
            discount_cents:
                  user.user_invite.discount_cents === 0
                    ? null
                    : 1000 - user.user_invite.discount_cents / 100
          }
          : null
      }
      : {}
  );

  const handleChange = (name, value, parent = null) => {
    setFormData((prevData) => {
      if (parent) {
        return {
          ...prevData,
          [parent]: {
            ...prevData[parent],
            [name]: value
          }
        };
      }
      return { ...prevData, [name]: value };
    });
  };

  const queryClient = useQueryClient();

  const { setAlarm } = useAlarm();
  const { mutate, isLoading: mutationIsLoading } = useMutation(
    adminAPI.updateUser,
    {
      onSuccess: (data) => {
        setOpenSideActionBoard();
        setAlarm({ type: 'success', message: data.message });
        queryClient.invalidateQueries('activeUsers');
        queryClient.invalidateQueries('userDetails');
      },
      onError: (error) => {
        setAlarm({ type: 'error', message: error.message });
      }
    }
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const serializedData = JSON.stringify(formData);
    mutate(serializedData);
  };

  return (
    <>
      <div className="flex justify-between items-center relative pb-4 px-8">
        <button
          className="p-2 flex items-center -ml-2"
          type="button"
          onClick={() => setOpenSideActionBoard()}
        >
          <SVG src={ChevronRightIcon} />
        </button>
        <button
          className="p-4 text-sm font-bold bg-purple-100 rounded-lg hover:bg-purple-200"
          type="button"
          onClick={() =>
            setOpenSideActionBoard({ ...openSideActionBoard, action: 'view' })
          }
        >
          View Details
        </button>
        <span
          style={{ width: 'calc(100% + 6rem)' }}
          className="absolute pin-b pin-r -mx-16 h-px bg-gray flex"
        />
      </div>
      <form
        className="overflow-y-scroll h-full px-8 py-8"
        onSubmit={handleSubmit}
      >
        <h1>
          {user.profile.first_name} {user.profile.last_name}
        </h1>
        <div style={{ gap: '16px' }} className="flex flex-col my-12">
          <FormInput
            label="Email"
            name="email"
            value={formData.email}
            type="text"
            handleChange={(e) => handleChange('email', e.target.value)}
          />
          <FormInput
            label="First Name"
            name="first_name"
            value={formData.first_name}
            type="text"
            handleChange={(e) => handleChange('first_name', e.target.value)}
          />
          <FormInput
            label="Last Name"
            name="first_name"
            value={formData.last_name}
            type="text"
            handleChange={(e) => handleChange('last_name', e.target.value)}
          />
          <FormInput
            label="Company"
            name="company"
            value={formData.company_name}
            type="text"
            handleChange={(e) => handleChange('company_name', e.target.value)}
          />
        </div>
        <UserInviteForm
          formData={formData}
          courses={user.courses}
          handleChange={handleChange}
          hubspotAccessTypes={user.hubspot_access_types}
        />

        <button
          className="p-4 my-10  bg-purple text-white font-semibold rounded-lg"
          type="submit"
        >
          Update User
        </button>
      </form>
      {mutationIsLoading && <FormLoader />}
    </>
  );
};

const IndividualUser = ({
  id,
  openSideActionBoard,
  setOpenSideActionBoard
}) => {
  const { action } = openSideActionBoard;

  const { data, isLoading } = useQuery(
    ['userDetails', { id }],
    userAPI.getUserDetails
  );

  const { contentData } = useData();

  const modules = contentData?.modules;

  if (isLoading || ! modules) {
    return null;
  }

  const { user } = data;

  if (data.user?.courses && modules.length > 0) {
    // Create a copy of data.user.courses and sort it based on the "id" property
    const sortedCourses = [...data.user.courses].sort((a, b) => {
      const idA = a.id;
      const idB = b.id;
      return modules.findIndex((module) => module.id === idA) - modules.findIndex((module) => module.id === idB);
    });
  
    // Assign the sortedCourses array back to data.user.courses
    data.user.courses = sortedCourses;
  }

  return (
    <>
      {action === 'view' && (
        <DisplayView
          user={user}
          openSideActionBoard={openSideActionBoard}
          setOpenSideActionBoard={setOpenSideActionBoard}
        />
      )}
      {action === 'edit' && (
        <UserEditForm
          user={user}
          openSideActionBoard={openSideActionBoard}
          setOpenSideActionBoard={setOpenSideActionBoard}
        />
      )}
    </>
  );
};

const AdminUserSideBar = ({
  openSideActionBoard,
  setOpenSideActionBoard,
  setCheckedActiveUsers,
  setUnconfirmedUsers,
  setPendingInvites
}) => {
  const { type, ids } = openSideActionBoard;

  return (
    <SideActionBoard setOpenSideActionBoard={setOpenSideActionBoard}>
      {(type === 'Active Users' || 'Unconfirmed Users') &&
        ids?.length === 1 && (
          <IndividualUser
            id={ids[0]}
            openSideActionBoard={openSideActionBoard}
            setOpenSideActionBoard={setOpenSideActionBoard}
          />
      )}

      {type === 'Invite Users' && (
        <>
          <div className="flex justify-between items-center relative pb-4 px-8">
            <button
              className="p-2 flex items-center -ml-2"
              type="button"
              onClick={() => setOpenSideActionBoard()}
            >
              <SVG src={ChevronRightIcon} />
            </button>
            <span
              style={{ width: 'calc(100% + 6rem)' }}
              className="absolute pin-b pin-r -mx-16 h-px bg-gray flex"
            />
          </div>
          <IndependentUserInviteForm
            title="Invite Users"
            setOpenSideActionBoard={setOpenSideActionBoard}
          />
        </>
      )}
      {ids?.length > 1 && (
        <>
          <div className="flex justify-between items-center relative pb-4 px-8">
            <button
              className="p-2 flex items-center -ml-2"
              type="button"
              onClick={() => setOpenSideActionBoard()}
            >
              <SVG src={ChevronRightIcon} />
            </button>
            <span
              style={{ width: 'calc(100% + 6rem)' }}
              className="absolute pin-b pin-r -mx-16 h-px bg-gray flex"
            />
          </div>
          <IndependentUserInviteForm
            items={ids && ids}
            type={type}
            title="Edit Users"
            setOpenSideActionBoard={setOpenSideActionBoard}
            setCheckedActiveUsers={setCheckedActiveUsers}
            setUnconfirmedUsers={setUnconfirmedUsers}
            setPendingInvites={setPendingInvites}
          />
        </>
      )}
    </SideActionBoard>
  );
};

export default AdminUserSideBar;
