import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import classNames from 'classnames';

import useModal from '../context/ModalContext';
import useAuth from '../context/AuthContext';
import TimeZoneSelect from './TimeZoneSelect';
import TimeSelect from './TimeSelect';

import IconSmartPhoneUpdate from '../../../../assets/images/reskin-images/icon--smartphone.svg';
import { CancelButton } from './Modal';
import HelpToHabitProgressList from './HelpToHabitProgressList';
import DaySelect from './DaySelect';
import { h2hAPI, userAPI } from '../api';
import { ConfirmPhone } from '../pages/PhoneVerification';

function SuccessModal({behaviorTitle}) {
  const { setContent } = useModal();
  return (
    <>
      <div className="flex justify-center items-center">
        <p className="mb-6">
          You&apos;ve successfully subscribed to{' '}
          <span className="font-bold">{behaviorTitle}</span> Help to Habit!
        </p>
      </div>
      <div className="flex gap-1 mt-auto items-center justify-end sticky md:static pin-b py-8 md:pt-16 md:pb-0">
        <button
          type="button"
          className="font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-2lg"
          onClick={() => setContent()}
        >
          Finish
        </button>
      </div>
    </>
  )
};

export function GetRemindedModal({ behaviorID, behaviorTitle }) {
  const queryClient = useQueryClient();
  const { userData } = useAuth();
  const { setContent, setIsLoading } = useModal();
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    userData?.settings.time_zone
  );
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedDay, setSelectedDay] = useState('');

  const { mutate } = useMutation(userAPI.subscribeToH2H, {
    onSuccess: () => {
      setIsLoading(false);
      queryClient.refetchQueries(['userHelpToHabitProgress']);
      queryClient.refetchQueries(['currentUser']);
      setContent({
        modalTitle: 'Success!',
        content: <SuccessModal behaviorTitle={behaviorTitle} />
      });
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    mutate({
      behaviorID,
      timeZone: selectedTimeZone,
      scheduledTime: selectedTime,
      startDate: selectedDay,
    });
  };

  const verificationComplete = () => {
    setContent({
      titleCallout: 'Get Reminded?',
      modalTitle: behaviorTitle,
      content: <GetRemindedModal behaviorID={behaviorID} behaviorTitle={behaviorTitle} />,
    });
  };

  const changeNumber = () => {
    setContent({
      modalTitle: "Change Your Phone Number",
      content: <ConfirmPhone onVerificationComplete={verificationComplete} changePhone={true} {...userData} />
    });
  };

  return (
    <>
      <form
        className="flex flex-col h-full"
        onSubmit={handleSubmit}
      >
        <p>
          You are subscribing to{' '}
          <span className="text-link-purple">{behaviorTitle}</span> Help to
          Habit campaign.
        </p>
        <p>
          You will receive text messages daily between 8 <span class="text-xs uppercase">am</span> and 
          8 <span class="text-xs uppercase">pm</span> for the next 30 days to help you build your habit.
        </p>
        <label htmlFor="timeZone" className="mt-4 font-semibold">
          Select your time zone:
        </label>
        <TimeZoneSelect
          selectedTimeZone={selectedTimeZone}
          setSelectedTimeZone={setSelectedTimeZone}
        />

        <label htmlFor="day" className="mt-4 font-semibold">
          Select your start day:
        </label>
        <DaySelect selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center mt-6 mb-8">
          <p className="font-semibold">
            Your phone number:{' '}
            <span className="text-link-purple">{userData?.profile.phone} </span>
          </p>
          <button
            type="button"
            onClick={changeNumber}
            className="font-normal text-charcoal"
          >
            Change Number
          </button>
        </div>

        <div
          style={{ gap: '4px' }}
          className="flex mt-auto items-center justify-end sticky md:static pin-b py-8 md:pb-0 bg-white"
        >
          <CancelButton />
          <button
            type="submit"
            className="font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-2lg"
          >
            Complete Activation
          </button>
        </div>
      </form>
    </>
  );
}

export function QueueModal({ behaviorID, behaviorTitle }) {
  const navigate = useNavigate();
  const { setContent, setIsLoading } = useModal();
  const queryClient = useQueryClient();
  const { data } = useQuery('userHelpToHabitProgress', () =>
    h2hAPI.getProgresses()
  );

  const hasMaxQueue = data?.length >= 3;
  const alreadyExists = data?.some(
    (item) => item.curriculum_behavior_id === behaviorID
  );

  const { mutate } = useMutation(userAPI.subscribeToH2H, {
    onSuccess: () => {
      setIsLoading(false);
      queryClient.refetchQueries(['userHelpToHabitProgress']);
      setContent({
        modalTitle: 'Success!',
        content: <SuccessModal behaviorTitle={behaviorTitle} />
      });
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const onClick = () => {
    if (alreadyExists) {
      navigate('v2/help-to-habit');
      setContent();
      return;
    }

    setIsLoading(true);
    mutate({ behaviorID });
  };

  return (
    <>
      <HelpToHabitProgressList />
        <div style={{ gap: '4px' }} className="flex mt-auto items-center justify-end pt-24" >
          <CancelButton />
          <button
            type="button"
            className="font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-lg"
            onClick={() => onClick()}
          >
            {alreadyExists ? 'Manage Queue' : 'Add to Queue'}
          </button>
        </div>
    </>
  );
}

export function IntroModal({ query, phoneIsVerified = false }) {
  const { setContent } = useModal();

  const goToGetStarted = () => {
    setContent({
      icon:  <SVG src={IconSmartPhoneUpdate} className="mb-1 mr-2" />,
      modalTitle: 'New! Help to Habit',
      content: <GetStartedModal query={query} />,
    });
  }

  const goToReminder = () => {
    setContent({
      titleCallout: 'Get Reminded?',
      modalTitle: query.behaviorTitle,
      content: <GetRemindedModal {...query} />,
    });

  }
  return (
    <>
      <div className="md:px-32 py-4 md:text-center">
        <p className="mb-4 text-xl font-semibold">Build a strong habit in 30 days</p>
        <p>Help to Habit reminders help you develop key leadership behavior with daily tips and reminders.</p>
      </div>

      <div
        className="flex gap-1 mt-auto items-center justify-end sticky md:static pin-b py-8 md:pb-0 bg-white"
      >
        <CancelButton />
        <button
          type="button"
          className="font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-2lg"
          onClick={phoneIsVerified ? goToReminder : goToGetStarted}
        >
          Get Started
        </button>
      </div>
    </>
  );
}


export function GetStartedModal({ query }) {
  const { userData } = useAuth();
  const { setContent } = useModal();
  const verificationComplete = () => {
    setContent({
      titleCallout: 'Get Reminded?',
      modalTitle: query.behaviorTitle,
      content: <GetRemindedModal {...query} />,
    });
  };

  const verifyPhoneButtonOnClick = () => {
    setContent({
      modalTitle: "Verify Your Information",
      content: <ConfirmPhone onVerificationComplete={verificationComplete} {...userData} />
    });
  };

  return (
    <>
      <div className="md:px-8 py-4 md:text-center">
        <p className="mb-4 text-xl font-semibold">Get reminders for leadership behavior</p>
        <p>You will receive text messages at the following phone number and time to help you build a leadership habit.<br />Confirm your mobile number now to get started!</p>
      </div>

      <div
        className="flex gap-1 mt-auto items-center justify-end sticky md:static pin-b py-8 md:pb-0 bg-white"
      >
        <CancelButton />
        <button
          type="button"
          className="font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-2lg"
          onClick={verifyPhoneButtonOnClick}
        >
          Verify Your Information
        </button>
      </div>
    </>
  );
}

export function GetRemindedButton({ query, text, classes, registeredHabit, showIcon = true }) {
  const { setContent } = useModal();
  const { userData } = useAuth();
  const phoneIsVerified = userData?.profile.phone_verified;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const h2hOptOut = userData?.h2h_opt_out;

  const { mutate, isLoading } = useMutation(userAPI.subscribeToH2H, {
    onSuccess: () => {
      queryClient.refetchQueries(['userHelpToHabitProgress']);
      queryClient.refetchQueries(['currentUser']);
      setContent({
        modalTitle: 'Success!',
        content: <SuccessModal behaviorTitle={query.behaviorTitle} />
      });
    }
  });

  const onClickHandler = () => {
    if(userData?.help_to_habit_progress_count === 0 && userData?.help_to_habit_progress_completed_count === 0) {
      setContent({
        icon:  <SVG src={IconSmartPhoneUpdate} className="mb-1 mr-2" />,
        modalTitle: 'New! Help to Habit',
        content: <IntroModal query={query} phoneIsVerified={phoneIsVerified} />,
      });
      return;
    }

    if (!phoneIsVerified) {
      setContent({
        icon:  <SVG src={IconSmartPhoneUpdate} className="mb-1 mr-2" />,
        modalTitle: 'New! Help to Habit',
        content: <GetStartedModal query={query} />,
      });
      return;
    }

    if (userData.help_to_habit_progress_count) {
      if (registeredHabit) {
        navigate('/v2/help-to-habit');
        return;
      }

      setContent({
        modalTitle: 'Your Help to Habit Queue',
        content: <QueueModal behaviorTitle={query.behaviorTitle} behaviorID={query.behaviorID} />,
      });
      return;
    }

    if (h2hOptOut) {
      if (registeredHabit) {
        navigate('/v2/help-to-habit');
        return;
      }
    }

    //TODO: if you've already completed at least one, it should just add it and show the success modal
    if(userData?.help_to_habit_progress_completed_count > 0) {
      mutate({ behaviorID: query.behaviorID });
      return;
    }

    setContent({
      titleCallout: 'Get Reminded?',
      modalTitle: query.behaviorTitle,
      content: <GetRemindedModal {...query} />,
    });
  };

  const label = text ? text : 'Get Reminded?';
  const classList = classes || "flex items-center text-link-purple"; 

  return (
    <button
      type="button"
      className={classNames(classList, {"opacity-50": isLoading})}
      onClick={() => onClickHandler()}
    >
      {showIcon && <SVG src={IconSmartPhoneUpdate} className="mr-2" />}
      <span className={showIcon ? "underline text-left" : undefined}>{label}</span>
    </button>
  );
}
