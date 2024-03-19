import React, { useState } from 'react';
import OutsideDetector from '../hooks/outsideDetector';
import DropdownMenu from './DropdownMenu';
import FormLoader from './FormLoader';


const AdminExportUsers = () => {
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getUsers = (status) => {
    const baseUrl = '/admin/users';
    const format = 'csv';
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const timestamp = date.getTime() / 1000;
    const setStatus = !status ? '' : `&status=${status}`;
    const url = `${baseUrl}?format=${format}&t=${timestamp}${setStatus}`;
    const name = status ? `${status}-users-${month}-${day}-${year}` : `all-users-${month}-${day}-${year}`;
    setShowLinkDropdown(!showLinkDropdown);
    setIsLoading(!isLoading);

    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const urlLink = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = urlLink;
        link.setAttribute('download', `${name}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const userExportActions = [
    {
      text: 'All Users',
      path: '',
      onClick: () => { getUsers(); },
      subList: [],
      role: 'admin'
    },
    {
      text: 'Active Users',
      path: '',
      onClick: () => { getUsers('confirmed'); },
      subList: [],
      role: 'admin'
    },
    {
      text: 'Unconfirmed Users',
      path: '',
      onClick: () => { getUsers('unconfirmed'); },
      subList: [],
      role: 'admin'
    },
    {
      text: 'Pending Users',
      path: '',
      onClick: () => { getUsers('pending'); },
      subList: [],
      role: 'admin'
    }
  ];

  return (
    <OutsideDetector className="relative" stateSetter={setShowLinkDropdown} style={{ marginLeft: '0.5rem' }}>
      <button type="button" className="btn--inverse border flex p-4  font-semibold rounded-lg" onClick={() => setShowLinkDropdown(!showLinkDropdown)}>
        <span>Export Users</span>
        <i className="mx-1 far fa-angle-down" />
      </button>
      {showLinkDropdown && (<DropdownMenu className="mt-3 pin-r" list={userExportActions} />)}
      {isLoading && <FormLoader />}
    </OutsideDetector>
  );
};

export default AdminExportUsers;
