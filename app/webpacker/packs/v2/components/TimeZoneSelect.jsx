import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { userAPI } from '../api';
import useAuth from '../context/AuthContext';

export default function TimeZoneDropDown({ selectedTimeZone, setSelectedTimeZone }) {
  const { userData } = useAuth();
  const { data, isLoading } = useQuery('timeZones', userAPI.getTimeZones);

  useEffect(() => {
    if (data) {
      const browserZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const defaultZone  = data.find(zone => zone.identifier === browserZone);
      setSelectedTimeZone(userData?.settings.time_zone || defaultZone?.time_zone);
    }
  }, [data, userData]);

  const handleSelectChange = (e) => {
    setSelectedTimeZone(e.target.value);
  };

  return (
    <select
      value={selectedTimeZone || ''}
      onChange={handleSelectChange}
      disabled={isLoading}
      className="block w-full px-4 py-2 border-2 border-gray focus:outline-none focus:border-link-purple rounded-lg appearance-none custom-select--arrow"
    >
      {data?.map((tz) => (
        <option key={tz.time_zone} value={tz.time_zone}>
          {`${tz.time_zone} — (UTC ${tz.offset})`}
        </option>
      ))}
    </select>
  );
}
