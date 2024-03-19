import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import SVG from 'react-inlinesvg';
import Pagination from '../../../components/Pagination';
import Table from '../../../components/Table';
import { convertToDollarString, formatDate } from '../../../helpers';
import SearchInput from '../../../components/SearchInput';
import useStopScrolling from '../../../hooks/useStopScrolling';

import { adminAPI, userAPI } from '../../../api';

import EditIcon from '../../../../../../assets/images/reskin-images/icon--edit.svg';
import EyeIcon from '../../../../../../assets/images/reskin-images/icon--eye.svg';
import BinIcon from '../../../../../../assets/images/reskin-images/icon--bin.svg';
import SendIcon from '../../../../../../assets/images/reskin-images/icon--send.svg';
import AdminUserSideBar from '../../../components/AdminUserSideBar';
import useModal from '../../../context/ModalContext';
import useAlarm from '../../../context/AlarmContext';
import useAuth from '../../../context/AuthContext';
import FormLoader from '../../../components/FormLoader';
import AdminExportUsers from '../../../components/AdminExportUsers';
import getSimpleUsersReportData from '../../../helpers/getSimpleUsersReportData';
import getUsersH2HReportData from '../../../helpers/getUsersH2HReportData';
import generateCVS from "../../../helpers/generateCVS";

const DestroyModal = ({ items, type, queryListId, setItems }) => {
  const { setAlarm } = useAlarm();
  const { setContent } = useModal();

  const queryClient = useQueryClient();

  const { mutate, isLoading: mutationIsLoading } = useMutation(
    (input) => adminAPI.destroyInvitationOrUsers(input.serializedData, input.type),
    {
      onSuccess: (data) => {
        setAlarm({ type: 'success', message: data.message });
        setContent({ title: null, body: null });
        setItems([]);
        queryClient.invalidateQueries(queryListId);
      },
      onSettled: (data, error) => {
        if (error) {
          setAlarm({ type: 'error', message: error.message });
        }
      }
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const serializedData = JSON.stringify(items);
    mutate({ serializedData, type });
  };

  const typeText = type === 'users' ? 'User' : 'Invitation';
  const appendS = items.length === 1 ? '' : 's';
  const finalText = typeText + appendS;
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className=" font-semibold">Delete {finalText}</h2>
        <p>
          Are you sure you want to delete the following{' '}
          {finalText.toLowerCase()}?
        </p>
        <div
          style={{ maxHeight: '400px' }}
          className="border-2 border-gray rounded-2lg p-4 overflow-y-scroll my-8"
        >
          {items.map((item) => (
            <p>{item.email}</p>
          ))}
        </div>

        <button
          type="submit"
          className=" font-semibold p-4 rounded-lg bg-red text-white"
        >
          Delete {items.count} {finalText}
        </button>
      </form>
      {mutationIsLoading && <FormLoader />}
    </>
  );
};

const ResendInviteModal = ({ items, setItems }) => {
  const { setAlarm } = useAlarm();
  const { setContent } = useModal();

  const queryClient = useQueryClient();

  const { mutate, isLoading: mutationIsLoading } = useMutation(adminAPI.resendInvites, {
    onSuccess: (data) => {
      setAlarm({ type: 'success', message: data.message });
      setContent({ title: null, body: null });
      setItems([]);
      queryClient.invalidateQueries('pendingInvites');
    },
    onSettled: (data, error) => {
      if (error) {
        setAlarm({ type: 'error', message: error.message });
      }
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const serializedData = JSON.stringify(items);
    mutate(serializedData);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className=" font-semibold">Resend Invites</h2>
        <p>You are resending invitation emails to the following users.</p>
        <div
          style={{ maxHeight: '400px' }}
          className="border-2 border-gray rounded-2lg p-4 overflow-y-scroll my-8"
        >
          {items.map((item) => (
            <p>{item.email}</p>
          ))}
        </div>

        <button
          type="submit"
          className=" font-semibold p-4 rounded-lg bg-green-light text-white mt-4"
        >
          Resend Invites
        </button>
      </form>
      {mutationIsLoading && <FormLoader />}
    </>
  );
};

const ActiveUsersTable = ({
  searchQuery,
  checkedActiveUsers,
  setCheckedActiveUsers,
  setOpenSideActionBoard
}) => {
  const [currentPage, setCurrentPage] = useState(
    data?.pagination?.current_page || 1
  );

  const { userData, isEmployee } = useAuth();
  const isAdmin = userData?.roles?.includes('admin');
  const hasAccess = isAdmin || isEmployee;

  const { data, isLoading } = useQuery(
    [
      'activeUsers',
      { page: currentPage, search: searchQuery, confirmed: true, count: 50 }
    ],
    adminAPI.getUsers
  );

  const columns = [
    {
      label: 'Name',
      field: 'name',
      textAlign: 'left',
      fontWeight: 'semibold',
      width: '25%'
    },
    {
      label: 'Email',
      field: 'email',
      textAlign: 'left',
      fontWeight: 'semibold',
      width: '40%'
    },
    {
      label: 'Signup Date',
      field: 'signupDate',
      textAlign: 'center',
      width: '20%'
    },
    { label: 'Discount', field: 'discount', textAlign: 'center', width: '15%' }
  ];

  FormLoader
  const [isCVSLoading , setCVSIsLoading] = useState(false);

  const [rowHovered, setRowHovered] = useState(false);

  const reconstructorFn = (user) => {
    const {
      id,
      email,
      created_at: createdAt,
      profile: { first_name: firstName, last_name: lastName },
      discounted_cents: discountedCents
    } = user;

    const actionButtons = (
      <div
        className={` absolute pin-r pin-t h-full items-center pr-2 ${
          rowHovered === id ? 'flex' : 'hidden'
        }`}
      >
        <button
          type="button"
          className="flex items-center justify-content-center bg-purple-100 p-2 rounded-lg mr-2 hover:bg-purple-200"
          onClick={() =>
            setOpenSideActionBoard({
              type: 'Active Users',
              action: 'view',
              ids: [id]
            })
          }
        >
          <SVG src={EyeIcon} />
        </button>
        <button
          type="button"
          className="flex items-center justify-content-center bg-purple-100 p-2 rounded-lg hover:bg-purple-200"
          onClick={() =>
            setOpenSideActionBoard({
              type: 'Active Users',
              action: 'edit',
              ids: [id]
            })
          }
        >
          <SVG src={EditIcon} />
        </button>
      </div>
    );

    return {
      id,
      // name: `${firstName ? firstName : ''} ${lastName ? lastName : ''}`,
      name: (
        <div>
          {firstName} {lastName} {actionButtons}
        </div>
      ),
      email,
      signupDate: formatDate(createdAt),
      discount: convertToDollarString(discountedCents)
    };
  };

  const { setContent } = useModal();

  const editButtonLabel = checkedActiveUsers?.length >= 2 ? 'Users' : 'User';

  const handleSimpleUserReport = async () => {
    setCVSIsLoading(true);
    const coursesData = await getSimpleUsersReportData(checkedActiveUsers);

    if (coursesData) {

      coursesData.forEach((entry) => {
        const foundationsCourse = entry.courses.find(
          (course) => course.title === "Foundations"
        );
        const otherCourses = entry.courses.filter(
          (course) => course.title !== "Foundations"
        );
        entry.courses = [foundationsCourse, ...otherCourses];
      });

      let csv =
        "Name," +
        coursesData?.[0]?.courses.map((course) => `"${course.title}"`).join(",") +
        "\n";

      coursesData.forEach((entry) => {
        const name = `"${entry.first_name} ${entry.last_name}"`;
        const courseData = entry.courses
          .map((course) => course.percentage_completed)
          .join(",");
        csv += `${name},${courseData}\n`;
      });

      const currentDate = new Date().toISOString().slice(0, 10);
      generateCVS(csv, `users_report_${currentDate}`);
      setCVSIsLoading(false);
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate.replace(/\//g, '-');
  };

  const formatPhoneNumber = (phoneNumber) => {
    const digits = phoneNumber.replace(/\D/g, '');

    if (digits.length !== 10) {
      return "Invalid phone number";
    }

    const formattedNumber = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    
    return formattedNumber;
  };

  const handleH2HReport = async () => {
    setCVSIsLoading(true);
    const habitData = await getUsersH2HReportData();

    if (habitData) {
      habitData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      let csv = "Name, Email, Phone, Behavior, Module, Day, Created" + "\n";

      habitData.forEach((entry) => {
        csv += `"${entry.name}",${entry.email},${formatPhoneNumber(entry.phone)},"${entry.behavior_title}","${entry.module.title}",${entry.progress + 1},${formatDate(entry.created_at)}\n`;
      });

      const currentDate = new Date().toISOString().slice(0, 10);
      generateCVS(csv, `habits_report_${currentDate}`);
      setCVSIsLoading(false);
    }
  };

  return (
    <>
      {hasAccess && (
        <div>
          <div className="mb-4 ml-10 flex items-center">
            <h2 className=" font-semibold">Active Users</h2>
          {checkedActiveUsers?.length >= 1 ? (
            <>
              <button
                onClick={() =>
                  setOpenSideActionBoard({
                    type: 'Active Users',
                    action: 'edit',
                    ids: checkedActiveUsers
                  })
                }
                type="button"
                className="flex items-center font-semibold bg-purple-100 rounded-lg py-3 px-4 ml-8 hover:bg-purple-lightest"
              >
                <SVG src={EditIcon} className="mr-2" />
                Edit {checkedActiveUsers.length} {editButtonLabel}
              </button>
              <button
                onClick={() => handleSimpleUserReport() }
                type="button"
                className="flex items-center font-semibold bg-purple-100 rounded-lg py-3 px-4 ml-8 hover:bg-purple-lightest"
              >
                Activity Report for {checkedActiveUsers.length} {editButtonLabel}
              </button>
            </>
          ) : null}
          {checkedActiveUsers?.length ? (
            <button
              type="button"
              className="flex items-center font-semibold hover:bg-red-lighter rounded-lg p-3 ml-4"
              onClick={() => {
                setContent({
                  body: (
                    <DestroyModal
                      items={checkedActiveUsers}
                      type="users"
                      queryListId="activeUsers"
                      setItems={setCheckedActiveUsers}
                    />
                  )
                });
              }}
            >
              <SVG src={BinIcon} />
            </button>
          ) : null}
          
        </div>

        <button
          onClick={() => handleH2HReport() }
          type="button"
          className="flex items-center font-semibold bg-purple-100 rounded-lg py-3 px-4 ml-8 mb-8 hover:bg-purple-lightest"
        >
          Help to Habit Report
        </button>

        {!isLoading && data && (
          <Table
            id="active_users"
            data={data.users}
            columns={columns}
            reconstructorFn={reconstructorFn}
            checkedItems={checkedActiveUsers}
            setCheckedItems={setCheckedActiveUsers}
            setRowHovered={setRowHovered}
          />
        )}
        <Pagination
          currentPage={currentPage}
          totalPage={data?.pagination?.total_pages}
          onPageChange={(page) => setCurrentPage(page)}
        />
        {isCVSLoading && <FormLoader />}
      </div>
      )}
    </>
  );
};

const UnconfirmedUsersTable = ({
  searchQuery,
  unconfirmedUsers,
  setUnconfirmedUsers,
  setOpenSideActionBoard
}) => {
  const [currentPage, setCurrentPage] = useState(
    data?.pagination?.current_page || 1
  );
  const { data, isLoading } = useQuery(
    [
      'unconfirmedUsers',
      { page: currentPage, search: searchQuery, confirmed: false }
    ],
    adminAPI.getUsers
  );
  const columns = [
    {
      label: 'Name',
      field: 'name',
      textAlign: 'left',
      fontWeight: 'semibold',
      width: '25%'
    },
    {
      label: 'Email',
      field: 'email',
      textAlign: 'left',
      fontWeight: 'semibold',
      width: '40%'
    },
    {
      label: 'Signup Date',
      field: 'signupDate',
      textAlign: 'center',
      width: '20%'
    },
    { label: 'Discount', field: 'discount', textAlign: 'center', width: '15%' }
  ];

  const [rowHovered, setRowHovered] = useState(false);

  const reconstructorFn = (user) => {
    const {
      id,
      email,
      created_at: createdAt,
      profile: { first_name: firstName, last_name: lastName },
      discounted_cents: discountedCents
    } = user;

    const actionButtons = (
      <div
        className={` absolute pin-r pin-t h-full items-center pr-2 ${
          rowHovered === id ? 'flex' : 'hidden'
        }`}
      >
        <button
          type="button"
          className="flex items-center justify-content-center bg-purple-100 p-2 rounded-lg mr-2 hover:bg-purple-200"
          onClick={() =>
            setOpenSideActionBoard({
              type: 'Unconfirmed Users',
              action: 'view',
              ids: [id]
            })
          }
        >
          <SVG src={EyeIcon} />
        </button>
        <button
          type="button"
          className="flex items-center justify-content-center bg-purple-100 p-2 rounded-lg hover:bg-purple-200"
          onClick={() =>
            setOpenSideActionBoard({
              type: 'Unconfirmed Users',
              action: 'edit',
              ids: [id]
            })
          }
        >
          <SVG src={EditIcon} />
        </button>
      </div>
    );

    return {
      id,
      name: (
        <div>
          {firstName} {lastName} {actionButtons}
        </div>
      ),
      email,
      signupDate: formatDate(createdAt),
      discount: convertToDollarString(discountedCents)
    };
  };

  const { setContent } = useModal();
  return (
    <div>
      <div className="mb-4 ml-10 flex items-center">
        <h2 className="font-semibold">Unconfirmed Users</h2>
        {unconfirmedUsers?.length >= 2 ? (
          <button
            onClick={() =>
              setOpenSideActionBoard({
                type: 'Unconfirmed Users',
                action: 'edit',
                ids: unconfirmedUsers
              })
            }
            type="button"
            className="flex items-center font-semibold bg-purple-100 rounded-lg py-3 px-4 ml-8 hover:bg-purple-lightest"
          >
            <SVG src={EditIcon} className="mr-2" />
            Edit {unconfirmedUsers.length} Selected Users
          </button>
        ) : null}
        {unconfirmedUsers?.length ? (
          <button
            type="button"
            className="flex items-center font-semibold hover:bg-red-lighter rounded-lg p-3 ml-4"
            onClick={() => {
              setContent({
                body: (
                  <DestroyModal
                    items={unconfirmedUsers}
                    type="users"
                    queryListId="unconfirmedUsers"
                    setItems={setUnconfirmedUsers}
                  />
                )
              });
            }}
          >
            <SVG src={BinIcon} />
          </button>
        ) : null}
      </div>

      {!isLoading && data && (
        <Table
          id="unconfirmed_users"
          data={data.users}
          columns={columns}
          reconstructorFn={reconstructorFn}
          checkedItems={unconfirmedUsers}
          setCheckedItems={setUnconfirmedUsers}
          setRowHovered={setRowHovered}
        />
      )}
      <Pagination
        currentPage={currentPage}
        totalPage={data?.pagination?.total_pages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

const PendingInvitesTable = ({
  searchQuery,
  pendingInvites,
  setPendingInvites,
  setOpenSideActionBoard
}) => {
  const [currentPage, setCurrentPage] = useState(
    data?.pagination?.current_page || 1
  );
  const { data, isLoading } = useQuery(
    ['pendingInvites', { page: currentPage, search: searchQuery }],
    adminAPI.getUserInvites
  );
  const columns = [
    {
      label: 'Email',
      field: 'email',
      textAlign: 'left',
      fontWeight: 'semibold',
      width: '40%'
    },
    {
      label: 'Domain',
      field: 'domain',
      textAlign: 'left',
      fontWeight: 'semibold',
      width: '15%'
    },
    {
      label: 'Sent',
      field: 'sent',
      textAlign: 'center',
      width: '15%'
    },
    {
      label: 'Expires',
      field: 'expires',
      textAlign: 'center',
      width: '15%'
    },
    { label: 'Discount', field: 'discount', textAlign: 'center', width: '15%' }
  ];

  const [rowHovered, setRowHovered] = useState(false);

  const reconstructorFn = (userInvite) => {
    const {
      id,
      email,
      domain,
      invited_at: invitedAt,
      expires_at: expiresAt,
      discounted_cents: discountedCents
    } = userInvite;

    const actionButtons = (
      <div
        className={` absolute pin-r pin-t h-full items-center pr-2 ${
          rowHovered === id ? 'flex' : 'hidden'
        }`}
      >
        <button
          type="button"
          className="flex items-center justify-content-center bg-purple-100 p-2 rounded-lg mr-2 hover:bg-purple-200"
          onClick={() =>
            setOpenSideActionBoard({
              type: 'Pending Invites',
              action: 'view',
              ids: [id]
            })
          }
        >
          <SVG src={EyeIcon} />
        </button>
        <button
          type="button"
          className="flex items-center justify-content-center bg-purple-100 p-2 rounded-lg hover:bg-purple-200"
          onClick={() =>
            setOpenSideActionBoard({
              type: 'Pending Invites',
              action: 'edit',
              ids: [id]
            })
          }
        >
          <SVG src={EditIcon} />
        </button>
      </div>
    );

    return {
      id,
      email,
      domain,
      sent: formatDate(invitedAt),
      expires: expiresAt ? formatDate(expiresAt) : '---',
      discount: convertToDollarString(discountedCents)
    };
  };

  const { setContent } = useModal();

  return (
    <div>
      <div className="mb-4 ml-10 flex items-center">
        <h2 className="font-semibold">Pending Invites</h2>
        {pendingInvites?.length ? (
          <button
            onClick={() =>
              setContent({
                body: (
                  <ResendInviteModal
                    items={pendingInvites}
                    setItems={setPendingInvites}
                  />
                )
              })
            }
            type="button"
            className="flex items-center font-semibold bg-purple-100 rounded-lg py-3 px-4 ml-8 hover:bg-purple-lightest"
          >
            <SVG src={SendIcon} className="mr-2" />
            Resend {pendingInvites.length} Selected Invites
          </button>
        ) : null}
        {pendingInvites?.length ? (
          <button
            type="button"
            className="flex items-center font-semibold hover:bg-red-lighter rounded-lg p-3 ml-4"
            onClick={() => {
              setContent({
                body: (
                  <DestroyModal
                    items={pendingInvites}
                    type="invites"
                    queryListId="pendingInvites"
                    setItems={setPendingInvites}
                  />
                )
              });
            }}
          >
            <SVG src={BinIcon} />
          </button>
        ) : null}
      </div>

      {!isLoading && (
        <Table
          id="unconfirmed_users"
          data={data.user_invites}
          columns={columns}
          reconstructorFn={reconstructorFn}
          checkedItems={pendingInvites}
          setCheckedItems={setPendingInvites}
          setRowHovered={setRowHovered}
        />
      )}
      <Pagination
        currentPage={currentPage}
        totalPage={data?.pagination?.total_pages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

const TabSelection = ({
  setCurrentTab,
  currentTab,
  searchQuery,
  setSearchQuery,
  setOpenSideActionBoard
}) => {
  const tabs = ['Active Users', 'Unconfirmed Users', 'Pending Invites'];
  const { userData, isEmployee } = useAuth();
  const isAdmin = userData?.roles?.includes('admin');
  const hasAccess = isAdmin || isEmployee;

  return (
    <div className="border-b-2 border-gray px-4 mb-8 flex pb-6">
      {hasAccess && (
        <ul style={{ gap: '24px' }} className="flex p-0 mr-8">
            {tabs.map((val) => (
            <button
              onClick={() => setCurrentTab(val)}
              key={crypto.randomUUID()}
              type="button"
              className={`relative  -mb-4 ${
                currentTab === val && searchQuery === '' && 'font-semibold'
              }`}
            >
              {val}
              {currentTab === val && searchQuery === '' && (
                <span
                  style={{
                    transform: 'translateX(-50%)',
                    left: '50%',
                    width: 'calc(100% + 30px)',
                    bottom: '-10px'
                  }}
                  className="absolute bg-purple h-1"
                />
              )}
            </button>
          ))}
        
        </ul>
      )}
      {hasAccess && (
        <SearchInput
          className="-mb-4"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          active={searchQuery !== ''}
        />
      )}
      <div className="flex ml-auto -mb-4">
        <button
          type="button"
          className="p-4  font-semibold bg-purple-100 hover:bg-purple-200 rounded-lg"
          onClick={() =>
            setOpenSideActionBoard({
              type: 'Invite Users',
              action: 'edit'
            })
          }
        >
          Invite Users
        </button>
        {hasAccess && (
          <AdminExportUsers />
        )}
      </div>
    </div>
  );
};

const AdminUser = () => {
  const [currentTab, setCurrentTab] = useState('Active Users');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedActiveUsers, setCheckedActiveUsers] = useState([]);
  const [unconfirmedUsers, setUnconfirmedUsers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [openSideActionBoard, setOpenSideActionBoard] = useState(); // {type: "", action: "", ids: # }

  useStopScrolling(openSideActionBoard);

  return (
    <div>
      {openSideActionBoard && (
        <AdminUserSideBar
          openSideActionBoard={openSideActionBoard}
          setOpenSideActionBoard={setOpenSideActionBoard}
          setCheckedActiveUsers={setCheckedActiveUsers}
          setUnconfirmedUsers={setUnconfirmedUsers}
          setPendingInvites={setPendingInvites}
        />
      )}
      <TabSelection
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setOpenSideActionBoard={setOpenSideActionBoard}
      />
      <div style={{ gap: '64px' }} className="flex flex-col">
        {(currentTab === 'Active Users' || searchQuery !== '') && (
          <ActiveUsersTable
            searchQuery={searchQuery}
            checkedActiveUsers={checkedActiveUsers}
            setCheckedActiveUsers={setCheckedActiveUsers}
            setOpenSideActionBoard={setOpenSideActionBoard}
          />
        )}
        {(currentTab === 'Unconfirmed Users' || searchQuery !== '') && (
          <UnconfirmedUsersTable
            searchQuery={searchQuery}
            unconfirmedUsers={unconfirmedUsers}
            setUnconfirmedUsers={setUnconfirmedUsers}
            setOpenSideActionBoard={setOpenSideActionBoard}
          />
        )}
        {(currentTab === 'Pending Invites' || searchQuery !== '') && (
          <PendingInvitesTable
            searchQuery={searchQuery}
            pendingInvites={pendingInvites}
            setPendingInvites={setPendingInvites}
            setOpenSideActionBoard={setOpenSideActionBoard}
          />
        )}
      </div>
    </div>
  );
};

export default AdminUser;
