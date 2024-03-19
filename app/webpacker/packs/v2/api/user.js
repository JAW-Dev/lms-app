import { csrfToken } from "@rails/ujs";
import { apiFetch } from "./apiFetch";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
  "X-CSRF-Token": csrfToken(),
};

export const getUser = () =>
  apiFetch({
    url: "/api/v2/users",
  });

export const updateUserPassword = (serializedData) =>
  apiFetch({
    url: '/api/v2/users/update_user_password',
    method: 'POST',
    body: serializedData
  });

export const updateUserSettings = async (serializedData) => {
  try {
    const res = await fetch("/api/v2/users/update_user", {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-Token": csrfToken(),
      },
      body: serializedData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update user settings");
    }

    return res.json();
  } catch (error) {
    throw new Error(error.message || "Failed to update user settings");
  }
};

export const updateUser = (serializedData) =>
  apiFetch({
    url: "/api/v2/users/update_user_data",
    method: "POST",
    body: serializedData,
  });

export const updateUserWatchStatus = ({ behaviorId, status }) =>
  apiFetch({
    url: "/api/v2/users/watch",
    method: "POST",
    body: { user_behavior: { behavior_id: behaviorId, status } },
  });

export const getUserDetails = ({ queryKey }) => {
  const [, { id }] = queryKey;
  return apiFetch({
    url: "/api/v2/admin/users/user_details",
    method: "POST",
    body: { user_id: id },
  });
};

export const getUsersDetails = ({ queryKey }) => {
  const [, { user_ids }] = queryKey;
  return apiFetch({
    url: "/api/v2/admin/users/users_details",
    method: "POST",
    body: { user_ids },
  });
};

export const updateUserPhoneNumber = ({ phoneNumber }) =>
  apiFetch({
    url: "/api/v2/users/set_phone_number",
    method: "POST",
    body: { phone_number: phoneNumber },
  });

export const generateAndSendCode = () =>
  apiFetch({
    url: "/api/v2/users/generate_and_save_verification_code",
    method: "POST",
  });

export const confirmVerificationCode = ({ verificationCode }) =>
  apiFetch({
    url: "/api/v2/users/confirm_verification_code",
    method: "POST",
    body: { verification_code: verificationCode },
  });

export const getTimeZones = () =>
  apiFetch({
    url: "/api/v2/users/time_zones",
  });

export const subscribeToH2H = ({
  behaviorID,
  timeZone,
  scheduledTime,
  startDate,
}) =>
  apiFetch({
    url: "/api/v2/users/subscribe_to_h2h",
    method: "POST",
    body: { behaviorID, timeZone, scheduledTime, startDate },
  });

export const editH2HSettings = ({ data: help_to_habit }) => {
  return apiFetch({
    url: '/api/v2/users/update_h2h',
    method: "PATCH",
    body: {
      help_to_habit,
    },
  });
}

export const updateQueueOrder = (habits) => {
  return apiFetch({
    url: '/api/v2/users/update_queue_order',
    method: "PATCH",
    body: {
      help_to_habit: {
        reorder: habits
      }
    },
  });
}

export const getUserAccessData = () =>
  apiFetch({
    url: "/api/v2/users/user_access_data",
    method: "GET",
  });

export const cancelSubscription = () =>
  apiFetch({
    url: "/api/v2/users/cancel_subscription",
    method: "POST",
  });

export const processResubscription = () =>
  apiFetch({
    url: "/api/v2/users/process_resubscription",
    method: "POST",
  });

export const registerNew = (serializedData) => {
  return apiFetch({
    url: '/api/v2/registrations',
    method: 'POST',
    body: serializedData,
  });
}

export const podcastCTA = () =>
  apiFetch({
    url: "/api/v2/users/podcast_cta",
    method: "POST",
  });
