import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
// Context
import SVG from 'react-inlinesvg';
import useAuth from '../../context/AuthContext';
import useAlarm from '../../context/AlarmContext';
// Helpers
import { updateUserSettings } from '../../api/user';
import { handleInputChange } from '../../helpers/formHandlers';
// Images
import UploadImage from '../../../../../assets/images/reskin-images/icon--upload-image.svg';
// Hooks
import useResponsive from '../../hooks/useResponsive';
// Components
import FormInput from '../../components/FormInput';
import FormLoader from '../../components/FormLoader';
import UserAvatar from '../../components/UserAvatar';
import Button from '../../components/Button';
import Text from '../../components/Text';
import FormCheckbox from '../../components/FormCheckbox';

const UserProfileSettings = () => {
  const { userData } = useAuth();
  const { isTablet } = useResponsive();
  const [avatarPreview, setAvatarPreview] = useState('');
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [showRemoveImage, setShowRemoveImage] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    email: '',
    avatar: '',
    first_name: '',
    last_name: '',
    opt_in: '',
    // text_opt_in: '',
    time_zone: {}
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        id: userData.id || '',
        email: userData.email || '',
        avatar: userData.profile?.avatar.url || '',
        first_name: userData.profile?.first_name || '',
        last_name: userData.profile?.last_name || '',
        opt_in: userData.profile?.opt_in || '',
        // text_opt_in: userData.profile?.text_opt_in || '',
        time_zone: userData.settings?.time_zone || '',
      });
      setAvatarPreview(userData.profile?.avatar.url);
      const avatar = userData.profile?.avatar.url && (typeof userData.profile?.avatar.url === 'string' && !userData.profile?.avatar?.url?.includes('blank-'));
      setShowRemoveImage(avatar);
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShowRemoveImage(true);
      setAvatarPreview(URL.createObjectURL(file));
      setFormData((prevFormData) => ({
        ...prevFormData,
        avatar: file
      }));
    }
  };

  const handleRemoveAvatarChange = (e) => {
    setRemoveAvatar(e.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newFormData = {
      id: formData.id,
      email: formData.email,
      avatar: formData.avatar,
      first_name: formData.first_name,
      last_name: formData.last_name,
      opt_in: formData.opt_in,
      // text_opt_in: formData.text_opt_in,
      remove_avatar: removeAvatar,
      settings: JSON.stringify({time_zone: formData.time_zone}),
    };

    const formDataObj = new FormData();

    for (const key in newFormData) {
      formDataObj.append(`user[${key}]`, newFormData[key]);
    }

    mutate(formDataObj);
  };

  const avatarOptions = {
    className: 'user_settings',
    style: {
      background: 'linear-gradient(0deg, rgba(139, 127, 219, 0.5), rgba(139, 127, 219, 0.5)), #FFFFFF',
      border: '1px solid rgba(60, 60, 60, 0.2)',
      borderRadius: '100%',
      width: '80px',
      height: '80px',
      color: 'white',
      fontWeight: '700',
      fontSize: '40px'
    },
    avatarUrl: avatarPreview,
    firstName: formData.first_name,
    lastName: formData.last_name
  };

  const buttonStyle = {
    background: 'rgba(139, 127, 219, 0.1)',
    borderRadius: '12px',
    color: '#6357B5',
    padding: '8px',
    gap: '10px',
    fontSize: '14px',
    lineHeight: '20px'
  };

  const labelStyles = {
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '16px',
    color: '#3C3C3C'
  };

  const formColumnsClasses = isTablet ? 'flex flex-col' : 'flex flex-row';
  const formColumnsCstyles = isTablet ? {} : { gap: '32px' };

  const handleCheckboxChange = (isChecked) => {
    console.log('Checkbox is', isChecked ? 'checked' : 'unchecked');
  };

  return (
    <div className="w-full px-8 lg:px-0">
      <Text size="h2" variant="h2" className="text-charcoal font-extrabold font-inter mb-4"> Manage Profile</Text>
      <div>
        { formData && (
          <form className="h-full user-profile-form" onSubmit={handleSubmit}>
            <div style={{ gap: '16px' }} className="flex flex-col pb-8">
              <div className="flex items-center mt-4" style={{ gap: '16px' }}>
                <UserAvatar options={avatarOptions} />

                <div className="user-avatar__controlls flex flex-col">
                  <input id="avatar" name="avatar" type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                  <span id="file-chosen" style={{ fontSize: '14px', marginBottom: '8px' }}>Profile Picture</span>
                  {!showRemoveImage && (
                    <label htmlFor="avatar" className="custom-file-upload flex align-center justify-between" style={buttonStyle}><SVG src={UploadImage} />Upload Image</label>
                  )}
                </div>

              </div>
            </div>
            {showRemoveImage && (
            <div className="pb-8">
              <FormCheckbox
                label="Remove Avatar"
                name="remove_avatar"
                checked={removeAvatar}
                onChange={handleRemoveAvatarChange}
                classes="mr-4"
                />
            </div>
            )}
            <div className="pb-4" style={{width: "300px"}}>
              <FormInput
                label="Email"
                name="email"
                value={formData.email}
                type="text"
                handleChange={(e) => handleInputChange(setFormData, 'email', e.target.value)}
              />
            </div>
            <div className={formColumnsClasses} style={formColumnsCstyles}>
              <div style={{width: "300px"}}>
                <FormInput
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  type="text"
                  classes="flex-1 mb-4"
                  handleChange={(e) => handleInputChange(setFormData, 'first_name', e.target.value)}
                />
              </div>
              <div style={{width: "300px"}}>
                <FormInput
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  type="text"
                  classes="flex-1"
                  handleChange={(e) => handleInputChange(setFormData, 'last_name', e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 user-profile-form__checkbox">
              <FormCheckbox
                label="Receive email communications from Admired Leadership"
                name="opt_in"
                checked={formData.opt_in}
                onChange={(e) => handleInputChange(setFormData, 'opt_in', e.target.checked)}
                classes="mr-4"
                />
            </div>
            <a href="" className="inline-block underline capitalize my-4 text-link-purple ">Read our privacy policy</a>
            <Button type="submit" variant="default-lowewrcase" className="font-bold capitalize" style={{ borderRadius: '12px' }}>Save Profile Changes</Button>
          </form>
        )}
        { mutationIsLoading && <FormLoader />}
      </div>
    </div>
  );
};

export default UserProfileSettings;
