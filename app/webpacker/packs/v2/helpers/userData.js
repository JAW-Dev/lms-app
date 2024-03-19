import useAuth from '../context/AuthContext';
import { userAPI } from '../api';

/**
 * Save the user settings with an API call.
 *
 * @param {object} data
 */
export const saveUserData = (data) => {
  userAPI.updateUser(data);
};

/**
 * Get all the user data.
 *
 * @returns object
 */
export const getUserData = () => {
  const { userData } = useAuth();
  if (userData && typeof userData === 'object') {
    return userData;
  }

  return {};
};

/**
 * Get the user.user_data object
 *
 * @returns object
 */
export const getUserSettings = (userData) => {
  if (userData && typeof userData === 'object') {
    return userData;
  }

  return {};
};

/**
 * Get the user.user_data.onboarding object
 *
 * @returns object
 */
export const getUserOnboarding = (userData) => {
  if (userData?.onboarding && typeof userData?.onboarding === 'object') {
    return userData?.onboarding;
  }

  return {};
};

/**
 * Check if onboarding has been set to true
 *
 * @param {string} key
 *
 * @returns boolean
 */
export const isOnboardingVisited = (key, userData) => {
  const urlParams = new URLSearchParams(window.location.search);
  const isDemoOnboarding = urlParams.get('demo') === 'onboarding';

  if (isDemoOnboarding) {
    return false;
  }

  const onboarding = userData?.user_data && userData?.user_data?.onboarding ? userData?.user_data?.onboarding : {};

  return onboarding[key] === true;
};
