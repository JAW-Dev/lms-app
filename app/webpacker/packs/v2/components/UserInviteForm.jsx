import React, { forwardRef, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import FormInput from './FormInput';
import SelectInput from './SelectInput';

import DollarIcon from '../../../../assets/images/reskin-images/icon--dollar.svg';
import Toggle from './Toggle';

const UserInviteForm = ({
  handleChange,
  courses,
  formData,
  hubspotAccessTypes,
  limitFields,
  includedFields,
  toggleIncludedField
}) => {
  const { user_invite: userInvite } = formData;
  const [inviteFormExists, setInviteFormExists] = useState(!!userInvite);

  // COURSES SELECT LOGIC
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    const initiallyEnrolledCourses = courses
      .filter((course) => course.enrolled_in)
      .map((course) => course.id);
    setSelectedCourses(initiallyEnrolledCourses);
  }, [courses]);

  const handleCheckAll = (checked) => {
    if (checked) {
      setSelectedCourses(courses.map((course) => course.id));
    } else {
      setSelectedCourses([]);
    }
  };

  const handleCourseCheck = (checked, courseId) => {
    if (checked) {
      setSelectedCourses((prevCourses) => [...prevCourses, courseId]);
    } else {
      setSelectedCourses((prevCourses) => prevCourses.filter((id) => id !== courseId)
      );
    }
  };

  useEffect(() => {
    if (inviteFormExists) {
      handleChange('course_ids', selectedCourses, 'user_invite');
    }
  }, [selectedCourses, inviteFormExists]);

  useEffect(() => {
    if (inviteFormExists) {
      handleChange(
        'invitation_access',
        userInvite?.invitation_access || 'limited',
        'user_invite'
      );
      handleChange('skip_email', true, 'user_invite');
    }
  }, [inviteFormExists]);

  const isCheckAll = selectedCourses.length === courses.length;

  // DATE LOGIC
  const today = new Date();
  const oneWeekFromToday = new Date(today);
  oneWeekFromToday.setDate(today.getDate() + 7);
  const oneYearFromToday = new Date(today);
  oneYearFromToday.setFullYear(today.getFullYear() + 1);
  const [selectedDate, setSelectedDate] = useState(new Date(userInvite?.expires_at || oneWeekFromToday));

  useEffect(() => {
    if (userInvite?.invitation_access === 'limited') {
      setSelectedDate(oneWeekFromToday);
      handleChange('expires_at', oneWeekFromToday, 'user_invite');
    }
    if (userInvite?.invitation_access === 'unlimited') {
      setSelectedDate(oneYearFromToday);
      handleChange('expires_at', oneYearFromToday, 'user_invite');
    }
  }, [userInvite?.invitation_access]);

  const DatePickerCustom = forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      className="border-2 border-gray rounded-lg p-4"
      onClick={onClick}
      ref={ref}
    >
      {value}
    </button>
  ));

  const showField = (fieldId) => {
    if (!limitFields) return true;
    return includedFields.includes(fieldId);
  };


  const [validForDays, setValidForDays] = useState(userInvite?.valid_for_days);
  const [toggleLengthField, setToggleLengthField] = useState(true);
  const [lengthType, setLengthType] = useState(userInvite?.length_type);

  useEffect(() => {
    if (userInvite?.expiration_type === 'length') {
      handleChange('valid_for_days', 7, 'user_invite');
      handleChange('expires_at', null, 'user_invite');
      setToggleLengthField(true);
    }
    if (userInvite?.expiration_type === 'date') {
      handleChange('valid_for_days', null, 'user_invite');
      setToggleLengthField(false);
    }
  }, [userInvite?.expiration_type]);

  useEffect(() => {
    setValidForDays(userInvite?.valid_for_days);
  }, [userInvite?.valid_for_days]);

  useEffect(() => {
    setLengthType(userInvite?.length_type);
  }, [userInvite?.length_type]);


  return userInvite ? (
    <div style={{ gap: '3rem' }} className="flex flex-col mt-4">

      {/* Modules */}
      <div>
        <div className="flex items-center">
          <p className="text-sm uppercase text-charcoal  font-bold">
            Modules
          </p>
          {limitFields && (
            <Toggle
              triggerFunction={toggleIncludedField}
              field="course_ids"
              className="ml-4"
            />
          )}
        </div>
        {showField('course_ids') && (
          <div className="rounded-lg border-2 border-gray p-2 mt-4 relative overflow-hidden">
            <div className="p-4 flex items-center border-b-2 border-gray">
              <input
                id='select-all'
                className="mr-4"
                type="checkbox"
                checked={isCheckAll}
                onChange={(e) => handleCheckAll(e.target.checked)}
              />
              <label for="select-all">Select All</label>
            </div>
            {courses.map((course) => {
              const { id, title } = course;
              return (
                <div
                  key={crypto.randomUUID()}
                  className="px-4 py-2 flex items-center"
                >
                  <input
                    id={id}
                    className="mr-4"
                    type="checkbox"
                    checked={selectedCourses.includes(id)}
                    onChange={(e) => handleCourseCheck(e.target.checked, id)}
                  />
                  <label for={id}>{title}</label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Access Type */}
      <div>
        <div className="flex items-center">
          <p className="text-sm uppercase text-charcoal  font-bold">
            Access Types
          </p>
          {limitFields && (
            <Toggle
              triggerFunction={toggleIncludedField}
              field="access_type"
              className="ml-4"
            />
          )}
        </div>
        {hubspotAccessTypes && showField('access_type') && (
          <SelectInput
            className="mt-4"
            name="access_type"
            value={userInvite?.access_type}
            options={hubspotAccessTypes}
            onChange={(name, value) => handleChange(name, value, 'user_invite')}
          />
        )}
      </div>

      {/* Add invitation Access */}
      <div className="">
        <div className="flex items-center">
          <p className="text-sm uppercase text-charcoal  font-bold">
            {userInvite.id ? 'Update Invitation Access' : 'Add Invitation Access'}
          </p>
          {limitFields && (
            <Toggle
              triggerFunction={toggleIncludedField}
              field="invitation_access"
              className="ml-4"
            />
          )}
        </div>

        {showField('invitation_access') && (
          <div className="flex rounded-lg overflow-hidden border-2 border-gray mt-4">
            <button
              onClick={() => {
                handleChange('invitation_access', 'limited', 'user_invite');
              }}
              type="button"
              className={`flex flex-col items-center justify-center py-4 w-1/2 ${
                userInvite.invitation_access === 'limited' && 'bg-purple-200'
              }`}
            >
              <p className="text-sm  font-semibold">Limited</p>
              <p className="text-sm  mt-2">Defaults to one week.</p>
              <p className="text-sm ">Sends "Week Access" email</p>
            </button>
            <button
              onClick={() => {
                handleChange('invitation_access', 'unlimited', 'user_invite');
              }}
              type="button"
              className={`flex flex-col items-center justify-center py-4 w-1/2 ${
                userInvite.invitation_access === 'unlimited' && 'bg-purple-200'
              }`}
            >
              <p className="text-sm  font-semibold">Unlimited</p>
              <p className="text-sm  mt-2">Defaults to one year.</p>
              <p className="text-sm ">Sends "Welcome" email</p>
            </button>
          </div>
        )}
      </div>

      {/* Add expriration type */}
      <div className="">
        <div className="flex items-center">
          <p className="text-sm uppercase text-charcoal  font-bold">
            {userInvite.id
              ? 'Update Expiration Type'
              : 'Add Expirtation Type'}
          </p>
          {limitFields && (
            <Toggle
              triggerFunction={toggleIncludedField}
              field="expiration_type"
              className="ml-4"
            />
          )}
        </div>

        {showField('expiration_type') && (
          <div className="flex rounded-lg overflow-hidden border-2 border-gray mt-4">
            <button
              onClick={() => {
                handleChange('expiration_type', 'length', 'user_invite');
              }}
              type="button"
              className={`flex flex-col items-center justify-center py-4 w-1/2 ${
                userInvite.expiration_type === 'length' && 'bg-purple-200'
              }`}
            >
              <p className="text-sm  font-semibold">Fixed Length</p>
              <p className="text-sm  mt-2">User has access for a fixed period</p>
              <p className="text-sm  mt-2">after joining.</p>
            </button>
            <button
              onClick={() => {
                handleChange('expiration_type', 'date', 'user_invite');
              }}
              type="button"
              className={`flex flex-col items-center justify-center py-4 w-1/2 ${
                userInvite.expiration_type === 'date' && 'bg-purple-200'
              }`}
            >
              <p className="text-sm  font-semibold">Fixed Date </p>
              <p className="text-sm  mt-2">User has access until selected date.</p>
            </button>
          </div>
        )}
      </div>

      {/* Invitation Length */}
      { toggleLengthField && (
      <div className="">
        <div className="flex items-center">
          <p className="text-sm uppercase text-charcoal  font-bold">
            Invitation Length
          </p>
          {limitFields && (
          <Toggle
            triggerFunction={toggleIncludedField}
            field="valid_for_days"
            className="ml-4"
          />
          )}
        </div>
        {showField('valid_for_days') && (
          <FormInput
            handleChange={(e) => handleChange('valid_for_days', e.target.value, 'user_invite')
              }
            type="number"
            value={userInvite?.valid_for_days}
            style={{ maxWidth: '55px' }}
          />
        )}

        {/* Length Type */}
        {showField('valid_for_days') && showField('length_type') && (
          <div className="flex rounded-lg overflow-hidden border-2 border-gray mt-4">
            <button
              onClick={() => {
                handleChange('length_type', 'days', 'user_invite');
              }}
              type="button"
              className={`flex flex-col items-center justify-center py-4 w-1/2 ${
                userInvite.length_type === 'days' && 'bg-purple-200'
              }`}
            >
              <p className="text-sm  font-semibold">Days</p>
            </button>
            <button
              onClick={() => {
                handleChange('length_type', 'years', 'user_invite');
              }}
              type="button"
              className={`flex flex-col items-center justify-center py-4 w-1/2 ${
                userInvite.length_type === 'years' && 'bg-purple-200'
              }`}
            >
              <p className="text-sm  font-semibold">Years</p>
            </button>
          </div>
        )}
      </div>
      )}

      {/* Expiration Date */}
      { !toggleLengthField && (
      <div className="">
        <div className="flex items-center">
          <p className="text-sm uppercase text-charcoal  font-bold">
            Expiration Date
          </p>
          {limitFields && (
            <Toggle
              triggerFunction={toggleIncludedField}
              field="expires_at"
              className="ml-4"
            />
          )}
        </div>
        {selectedDate && showField('expires_at') && (
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              handleChange('expires_at', date, 'user_invite');
            }}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            showPopperArrow={false}
            customInput={<DatePickerCustom />}
          />
        )}
      </div>
      )}

      {/* Misc */}
      <div className="">
        <p className="text-sm uppercase text-charcoal  font-bold mb-4">
          Misc.
        </p>
        <div className="rounded-lg border-2 border-gray p-2 mt-4">
          <div className="flex items-center">
            <input
              className="mx-4"
              type="checkbox"
              checked={userInvite.unlimited_gifting}
              onChange={(e) => handleChange(
                'unlimited_gifting',
                e.target.checked,
                'user_invite'
              )
              }
              disabled={!showField('unlimited_gifting')}
            />
            <p className={!showField('unlimited_gifting') && 'gray-text'}>
              Allow unlimiting gifting
            </p>
            {limitFields && (
              <Toggle
                triggerFunction={toggleIncludedField}
                field="unlimited_gifting"
                className="ml-4"
              />
            )}
          </div>
          <div className="flex">
            <input
              className="mx-4"
              type="checkbox"
              checked={userInvite.skip_email}
              onChange={(e) => handleChange('skip_email', e.target.checked, 'user_invite')
              }
            />
            <p>Skip sending email</p>
          </div>

          <div className="flex mb-4">
            <input
              className="mx-4"
              type="checkbox"
              checked={userInvite.opt_out_eop}
              onChange={(e) => handleChange('opt_out_eop', e.target.checked, 'user_invite')
              }
            />
            <p>Opt out of EOP</p>
          </div>

          <div className="flex items-center">
            <p className="text-sm uppercase text-charcoal  font-bold">
              Set preferred rate pricing
            </p>
            {limitFields && (
              <Toggle
                triggerFunction={toggleIncludedField}
                field="discount_cents"
                className="ml-4"
              />
            )}
          </div>
          {showField('discount_cents') && (
            <FormInput
              handleChange={(e) => handleChange('discount_cents', e.target.value, 'user_invite')
              }
              type="number"
              value={userInvite.discount_cents}
              icon={DollarIcon}
            />
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center flex-col w-full">
      <p>User does not have an invite</p>
      <button
        type="button"
        className="bg-purple-100 hover:bg-purple-200 p-4 flex items-center justify-center rounded-lg mt-2 font-semibold "
        onClick={() => setInviteFormExists(true)}
      >
        Create Invite
      </button>
    </div>
  );
};

export default UserInviteForm;
