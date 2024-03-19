import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
// Context
import useAuth from '../../context/AuthContext';
import useAlarm from '../../context/AlarmContext';
// API
import { updateUserSettings } from '../../api/user';
// Import Hooks
import useResponsive from '../../hooks/useResponsive';
// Components
import Text from '../../components/Text';
import FormLoader from '../../components/FormLoader';
import Button from '../../components/Button';
import TimeZoneSelect from '../../components/TimeZoneSelect';

const ManageAccount = () => {
  const { userData } = useAuth();
  const { isTablet } = useResponsive();
  const [selectedTimeZone, setSelectedTimeZone] = useState();
  const [formData, setFormData] = useState({
    id: '',
    time_zone: ''
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        id: userData.id || '',
        time_zone: userData.settings?.time_zone || '',
      });
      setSelectedTimeZone(userData.settings?.time_zone);
    }
  }, [userData]);

  const queryClient = useQueryClient();
  const { setAlarm } = useAlarm();
  const { mutate, isLoading: mutationIsLoading } = useMutation(updateUserSettings, {
    onSuccess: (data) => {
      setAlarm({ type: 'success', message: data.message });
      queryClient.invalidateQueries('currentUser');
    },
    onError: (error) => {
      setAlarm({ type: 'error', message: error.message });
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newFormData = {
      id: formData.id,
      settings: JSON.stringify({time_zone: selectedTimeZone}),
    };

    const formDataObj = new FormData();

    for (const key in newFormData) {
      formDataObj.append(`user[${key}]`, newFormData[key]);
    }

    try {
      const response = await mutate(formDataObj);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full px-8 lg:px-0">
      <Text size="h2" variant="h2" className="text-charcoal font-extrabold font-inter mb-8">Manage Account</Text>
      <h3 className="text-charcoal font-bold font-inter">Password Settings</h3>
      <Button href="/users/edit" variant="underline-link" className="mt-4 mb-8 underline">Click here to change or reset password</Button>
      <h3 className="text-charcoal font-bold font-inter">Time Zone</h3>
      <div>
        { formData && (
          <form className="h-full" onSubmit={handleSubmit}>
            <div className="mt-4 mb-8">
              <TimeZoneSelect selectedTimeZone={selectedTimeZone} setSelectedTimeZone={setSelectedTimeZone} />
            </div>
            <Button type="submit" variant="default-lowewrcase" className="font-bold capitalize" style={{ borderRadius: '12px' }}>Save Changes</Button>
          </form>
        )}
        { mutationIsLoading && <FormLoader />}
      </div>
    </div>
  );
};

export default ManageAccount;
