import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import useAuth from '../context/AuthContext';
import { userAPI } from '../api';
import useModal from '../context/ModalContext';
import { StepLoader } from '../components/Modal';

function formatPhoneNumber(input) {
  if (!input) return input;
  const numberInput = input.replace(/[^\d]/g, '');
  const numberInputLength = numberInput.length;

  if (numberInputLength < 4) {
    return numberInput;
  } if (numberInputLength < 7) {
    return `(${numberInput.slice(0, 3)}) ${numberInput.slice(3)}`;
  }
  return `(${numberInput.slice(0, 3)}) ${numberInput.slice(
    3,
    6
  )}-${numberInput.slice(6, 10)}`;
}

export function ConfirmPhone({ profile, onVerificationComplete, changePhone = false }) {
  const [phoneNumber, setPhoneNumber] = useState(formatPhoneNumber(profile.phone) || '');
  const [editMode, setEditMode] = useState(!profile.phone || changePhone);
  const queryClient = useQueryClient();
  const { setContent } = useModal();
  const { userData } = useAuth();

  const goToSendCode = (phone) => {
    const profileWithPhone = phone ? {...profile, phone} : profile;
    setContent({
      modalTitle: "Send Code",
      content: <SendCodeToPhone profile={profileWithPhone} onVerificationComplete={onVerificationComplete} />
    })
  }

  useEffect(() => {
    if(userData?.profile.phone && profile.phone !== userData?.profile.phone) {
      goToSendCode(userData.profile.phone);
    }
  }, [userData?.profile.phone])

  const handlePhoneNumber = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedPhoneNumber);
  };

  const phoneNumberMutation = useMutation(userAPI.updateUserPhoneNumber, {
    onSuccess: () => {
      queryClient.invalidateQueries('currentUser');
    },
    onError: (error) => {
      // Handle error, e.g., show an error message
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber) {
      // Remove non-digits from the phone number
      const sanitizedPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
      if(sanitizedPhoneNumber !== profile.phone) {
        phoneNumberMutation.mutate({ phoneNumber: sanitizedPhoneNumber });
      } else {
        goToSendCode();
      }
    }
  };

  return (
    <>
      {profile.phone && !editMode ? (
        <>
          <div className="md:px-8 py-4 md:text-center">
            <p className="mb-4 text-xl font-semibold">Confirm your phone number</p>
            <p>
              Your current phone number is:{' '}
              <span className="font-bold text-link-purple">
                {formatPhoneNumber(profile.phone)}
              </span>
            </p>
            <p>Do you want to proceed with this phone number?</p>
          </div>
          <div className="flex gap-1 mt-auto items-center justify-between py-8 md:pt-16 md:pb-0 sticky md:static pin-b bg-white">
            <button
              type="button"
              className="text-link-purple md:hover:text-purple"
              onClick={() => setEditMode(true)}
            >
              Edit Number
            </button>
            <button
              type="button"
              className="font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-2lg"
              onClick={() => goToSendCode()}
            >
              Continue
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col md:block h-full md:h-auto pt-4 pb-0 md:px-8 md:py-4 md:text-center">
          <div>
            <p className="mb-4 mr-auto">Enter a phone number to get started.</p>
            <div
              className="flex flex-col items-center flex-auto w-full"
            >
              <input
                onChange={(e) => handlePhoneNumber(e)}
                value={phoneNumber}
                placeholder="Enter number"
                className="border border-gray-300 rounded-2lg py-4 px-2 w-full"
              />
            </div>
          </div>
          <div className="flex flex-end mt-auto py-8 md:pt-16 md:pb-0 w-full sticky md:static pin-b bg-white">
            <button
              type="submit"
              className="mt-auto ml-auto flex font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-lg"
            >
              Next
            </button>
            {phoneNumberMutation.isLoading && <StepLoader />}
          </div>
        </form>
      )}
    </>
  );
}

export function SendCodeToPhone({ profile, onVerificationComplete }) {
  const queryClient = useQueryClient();
  const { setContent } = useModal();

  const { mutate, isLoading } = useMutation(userAPI.generateAndSendCode, {
    onSuccess: () => {
      queryClient.invalidateQueries('currentUser');
      setContent({
        modalTitle: "Enter Code",
        content: <EnterCode profile={profile} onVerificationComplete={onVerificationComplete} />
      });
    },
    onError: (error) => {
      // Handle error, e.g., show an error message
    }
  });

  const goToConfirmPhone = () => {
    setContent({
      modalTitle: "Vertify Your Information",
      content: <ConfirmPhone profile={profile} />
    });
  }

  const handleClick = () => {
    mutate();
  };

  return (
    <>
      <div className="md:px-8 py-4 md:text-center">
        <p className="mb-4">
          We&apos;re about to send a 6-digit verification code to the phone
          number:
        </p>
        <p className="mb-4 font-bold text-xl text-link-purple">
          {formatPhoneNumber(profile.phone)}
        </p>
        <p className="mb-4">
          Please make sure this phone number is correct and able to receive SMS.<br />
          Standard messaging rates may apply.
        </p>
      </div>
      <div
        className="flex gap-4 mt-auto items-center justify-end sticky md:static pin-b py-8 md:pt-16 md:pb-0"
      >
        <button type="button" className="font-semibold" onClick={goToConfirmPhone}>Go Back</button>
        <button
          onClick={handleClick}
          type="button"
          className="mt-auto flex font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-lg"
        >
          Send Code
        </button>
        {isLoading && <StepLoader />}
      </div>
    </>
  );
}

function EnterCode({ profile, onVerificationComplete }) {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const otpInputRefs = Array(6)
    .fill(0)
    .map(() => useRef());

  const queryClient = useQueryClient();
  const { setContent } = useModal();

  const verify = useMutation(userAPI.confirmVerificationCode, {
    onSuccess: () => {
      queryClient.invalidateQueries('currentUser');
      setContent({
        modalTitle: "Confirmation",
        content: <VerificationSuccess profile={profile} onVerificationComplete={onVerificationComplete} />
      });
    },
    onError: (error) => {
      // Handle error, e.g., show an error message
    }
  });

  const sendCode = useMutation(userAPI.generateAndSendCode, {
    onSuccess: () => {
      queryClient.invalidateQueries('currentUser');
    },
    onError: (error) => {
      // Handle error, e.g., show an error message
    }
  });

  const focusInput = (inputIndex) => {
    if (inputIndex < otpInputRefs.length) {
      otpInputRefs[inputIndex].current.focus();
    }
  };

  const handleChange = (e, index) => {
    const { value } = e.target;

    if (value.length <= 1) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });

      if (value) focusInput(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = '';
        if (index > 0) newOtp[index - 1] = '';
        return newOtp;
      });

      if (index > 0) focusInput(index - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    verify.mutate({ verificationCode: otpCode });
  };

  const goToSendCode = () => {
    setContent({
      modalTitle: "Send Code",
      content: <SendCodeToPhone profile={profile} />
    });
  }


  // Auto-focus the first input field on component mount
  useEffect(() => {
    focusInput(0);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="h-full md:h-auto flex flex-col md:block">
      <div className="md:px-8 py-4 md:text-center">
        <div
          className="flex items-center justify-center gap-2 mb-2"
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              name={`digit-${index}`}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={otpInputRefs[index]}
              className="p-4 text-lg text-center font-bold border-2 border-gray-300 rounded-2lg w-full md:w-12 focus:border-link-purple focus:outline-none"
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => sendCode.mutate()}
          className="font-medium  text-link-purple md:hover:text-purple mb-4"
        >
          Resend Code
        </button>
      </div>
      <div class="md:px-8 md:text-center">
        <p className="mb-4">
          Enter the code sent to {formatPhoneNumber(profile.phone)}.
        </p>
        <p>
          Please enter the code sent to your phone. The code is valid for 5
          minutes from the time it was sent. If you do not enter the code within
          this timeframe, it will expire and you&apos;ll need to request a new
          one.
        </p>
      </div>
      <div
        className="flex mt-auto items-center justify-end gap-4 sticky md:static pin-b py-8 md:pt-16 md:pb-0"
      >
        <button type="button" className="font-semibold" onClick={goToSendCode}>Go Back</button>
        <button
          type="submit"
          className="mt-auto flex font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-lg"
        >
          Submit
        </button>
        {(verify.isLoading || sendCode.isLoading) && <StepLoader />}
      </div>
    </form>
  );
}

function VerificationSuccess({ profile, onVerificationComplete }) {
  return (
    <>
      <div className="md:px-8 py-4 md:text-center">
        <h2 className="mb-4 text-xl font-semibold">Success!</h2>
        <p>
          Your phone number{' '}
          <span className="text-link-purple">
            {formatPhoneNumber(profile.phone)}
          </span>{' '}
          has been successfully verified.
        </p>
      </div>

      <div className="flex gap-1 mt-auto items-center justify-end sticky md:static pin-b py-8 md:pt-16 md:pb-0">
        <button
          type="button"
          className="font-bold text-sm text-white bg-link-purple py-3 px-4 rounded-2lg"
          onClick={onVerificationComplete}
        >
          Continue
        </button>
      </div>
    </>
  );
}
