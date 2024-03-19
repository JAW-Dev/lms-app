import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import UserInviteForm from './UserInviteForm';

import useAlarm from '../context/AlarmContext';
import FormLoader from './FormLoader';
import SimplifiedTable from './SimplifiedUserTable';
import { adminAPI } from '../api';

const EmailItem = ({ email, onRemove }) => (
  <div className="email-item shadow flex px-1 items-center rounded">
    {email}
    <button
      type="button"
      className="ml-2 flex items-center justify-center"
      onClick={() => onRemove(email)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          stroke="#6357B5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M18 6 6 18M6 6l12 12"
        />
      </svg>
    </button>
  </div>
);

const IndependentUserInviteForm = ({
  setOpenSideActionBoard,
  items,
  title,
  type,
  setCheckedActiveUsers,
  setUnconfirmedUsers,
  setPendingInvites
}) => {
  const emailInputRef = useRef(null);

  const [emailList, setEmailList] = useState([]);
  const [emailInput, setEmailInput] = useState('');

  const handleEmailInputChange = (event) => {
    setEmailInput(event.target.value);
  };

  const handleEmailInputKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      if (emailInput) {
        setEmailList((prevEmailList) => [...prevEmailList, emailInput]);
        setEmailInput('');
      }
    } else if (
      event.key === 'Backspace' &&
      emailInput === '' &&
      emailList.length > 0
    ) {
      event.preventDefault();
      setEmailList((prevEmailList) => {
        const lastEmailIndex = prevEmailList.length - 1;
        const lastEmail = prevEmailList[lastEmailIndex];
        setEmailInput(lastEmail);
        return prevEmailList.slice(0, lastEmailIndex);
      });
    }
  };

  const removeEmail = useCallback((emailToRemove) => {
    setEmailList((prevEmailList) => prevEmailList.filter((email) => email !== emailToRemove)
    );
  }, []);

  const { data, isLoading } = useQuery('invidation_data', adminAPI.getInvitationData);

  const [formData, setFormData] = useState({
    access_type: '5 Free Videos',
    expires_at: null,
    unlimited_gifting: false,
    invitation_access: 'limited',
    skip_email: true,
    course_ids: null,
    discount_cents: null,
    opt_out_eop: false,
    expiration_type: 'length',
    valid_for_days: null,
    length_type: 'days'
  });
  const [selected, setSelected] = useState(items);
  const [includedFields, setIncludedFields] = useState(['emails', 'skip_email']);
  const toggleIncludedField = (toggle, field) => {
    if (toggle) {
      setIncludedFields((prev) => [...prev, field]);
    } else {
      setIncludedFields((prev) => prev.filter((f) => f !== field));
    }
  };

  const handleChange = (name, value, parent = null) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const queryClient = useQueryClient();

  const queryListId =
    type === 'Active Users'
      ? 'activeUsers'
      : type === 'Unconfirmed Users'
        ? 'unconfirmedUsers'
        : 'pendingInvites';

  const { setAlarm } = useAlarm();
  const { mutate, isLoading: mutationIsLoading } = useMutation(adminAPI.inviteUsers, {
    onSuccess: (data) => {
      setAlarm({ type: 'success', message: data.message });
      setOpenSideActionBoard();
      if (type === 'Active Users') setCheckedActiveUsers([]);
      if (type === 'Unconfirmed Users') setUnconfirmedUsers([]);
      if (type === 'Pending Invites') setPendingInvites([]);
      queryClient.invalidateQueries(queryListId);
      queryClient.invalidateQueries('userDetails');
    },
    onError: (error) => {
      setAlarm({ type: 'error', message: error.message });
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selected) {
      formData.emails = selected.map((item) => item.email);
    } else {
      formData.emails = emailList;
    }
    if (items) {
      const filteredFormData = {};
      Object.keys(formData).forEach((key) => {
        if (includedFields.includes(key)) {
          filteredFormData[key] = formData[key];
        }
      });
      const serializedData = JSON.stringify(filteredFormData);
      mutate(serializedData);
    } else {
      const serializedData = JSON.stringify(formData);
      mutate(serializedData);
    }
  };

  useEffect(() => {
    if (type === 'Active Users') {
      setCheckedActiveUsers(selected);
    }
    if (type === 'Unconfirmed Users') {
      setUnconfirmedUsers(selected);
    }
    if (type === 'Pending Invites') {
      setPendingInvites(selected);
    }
  }, [selected]);

  return (
    !isLoading &&
    data && (
      <form className="p-8 overflow-y-scroll h-full" onSubmit={handleSubmit}>
        <h2 className="mb-8  font-semibold">{title}</h2>
        {!items ? (
          <>
            <p className="text-sm uppercase text-charcoal  font-bold mb-4">
              Emails
            </p>
            <div
              style={{ gap: '8px' }}
              className="email-list w-full p-4 flex flex-wrap border-2 border-gray rounded-lg relative"
              onClick={() => emailInputRef.current.focus()}
            >
              {emailInputRef.current !== document.activeElement &&
                emailList.length === 0 && (
                  <p className="text-gray absolute pin-t pin-l m-4 ml-5">
                    Enter an email and press Enter or Tab
                  </p>
              )}
              {emailList.map((email) => (
                <EmailItem
                  key={crypto.randomUUID()}
                  email={email}
                  onRemove={removeEmail}
                />
              ))}
              <input
                ref={emailInputRef}
                type="email"
                className="email-input outline-none bg-transparent border-none  "
                value={emailInput}
                onChange={(e) => {
                  handleEmailInputChange(e);
                  e.target.size = e.target.value.length || 1;
                }}
                onKeyDown={handleEmailInputKeyDown}
                size={emailInput.length || 1}
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-sm uppercase text-charcoal  font-bold mb-4">
              Selected Users
            </p>
            <SimplifiedTable
              data={items}
              checkedItems={selected}
              setCheckedItems={setSelected}
            />
          </>
        )}
        <UserInviteForm
          formData={{ user_invite: formData }}
          courses={data.enabled_courses}
          handleChange={handleChange}
          hubspotAccessTypes={data.hubspot_options}
          limitFields={!!items}
          toggleIncludedField={toggleIncludedField}
          includedFields={includedFields}
        />
        <button
          className="p-4 my-10  bg-purple text-white font-semibold rounded-lg"
          type="submit"
        >
          {items ? 'Update Users' : 'Send Invitations'}
        </button>
        {mutationIsLoading && <FormLoader />}
      </form>
    )
  );
};

export default IndependentUserInviteForm;
