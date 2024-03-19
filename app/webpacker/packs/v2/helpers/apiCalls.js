import { csrfToken } from '@rails/ujs';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'X-CSRF-Token': csrfToken()
};

export const fetchUser = async () => {
  const res = await fetch('/api/v2/users', {
    method: 'GET',
    headers
  });

  return res.json();
};

export const fetchUsers = async ({ queryKey }) => {
  const [, { page, search, confirmed }] = queryKey;
  const res = await fetch('/api/v2/admin/users/users', {
    method: 'POST',
    headers,
    body: JSON.stringify({ page, search, confirmed })
  });

  return res.json();
};

export const fetchUserInvites = async ({ queryKey }) => {
  const [, { page, search }] = queryKey;
  const res = await fetch('/api/v2/admin/users/user_invites', {
    method: 'POST',
    headers,
    body: JSON.stringify({ page, search })
  });

  return res.json();
};

export const fetchUserDetails = async ({ queryKey }) => {
  const [, { id }] = queryKey;
  const res = await fetch('/api/v2/admin/users/user_details', {
    method: 'POST',
    headers,
    body: JSON.stringify({ user_id: id })
  });

  return res.json();
};

export const updateUser = async (serializedData) => {
  const res = await fetch('/api/v2/admin/users/update_user', {
    method: 'POST',
    headers,
    body: serializedData
  });

  if (res.ok) {
    return res.json();
  }

  const error = await res.json();
  throw new Error(error.errors.join(', '));
};

export const updateUserData = async (serializedData) => {
  const res = await fetch('/api/v2/users/update_user_data', {
    method: 'POST',
    headers,
    body: serializedData
  });

  if (res.ok) {
    return true;
  }

  const error = await res.json();
  throw new Error(error.errors.join(', '));
};

export const inviteUsers = async (serializedData) => {
  const res = await fetch('/api/v2/admin/users/invite_users', {
    method: 'POST',
    headers,
    body: serializedData
  });
  if (res.ok) {
    return res.json();
  }
  const error = await res.json();
  throw new Error(error.message);
};

export const fetchInvitationData = async () => {
  const res = await fetch('/api/v2/admin/users/invitation_data', {
    method: 'GET',
    headers
  });

  return res.json();
};

export const destroyInvites = async (serializedData) => {
  const res = await fetch('/api/v2/admin/users/destroy_invites', {
    method: 'POST',
    headers,
    body: serializedData
  });

  if (res.ok) {
    return res.json();
  }
  const error = await res.json();
  throw new Error(error.message);
};

export const destroyUsers = async (serializedData) => {
  const res = await fetch('/api/v2/admin/users/destroy_users', {
    method: 'POST',
    headers,
    body: serializedData
  });

  if (res.ok) {
    return res.json();
  }

  const error = await res.json();
  throw new Error(error.message);
};

export const destroyInvitationOrUsers = async (serializedData, type) => {
  if (type === 'users') {
    const res = await destroyUsers(serializedData);
    return res;
  }
  if (type === 'invites') {
    const res = await destroyInvites(serializedData);
    return res;
  }
};

export const resendInvites = async (serializedData) => {
  const res = await fetch('/api/v2/admin/users/resend_invites', {
    method: 'POST',
    headers,
    body: serializedData
  });

  if (res.ok) {
    return res.json();
  }

  const error = await res.json();
  throw new Error(error.message);
};

export const fetchLatestFieldNote = async () => {
  const res = await fetch(
    'https://admiredleadership.com/wp-json/wp/v2/field_notes?&order_by=modified,date&order=desc&per_page=1'
  );
  if (res.ok) {
    const data = await res.json();
    return data[0];
  }
};

export const fetchNote = async ({ queryKey }) => {
  const [, { behavior_id }] = queryKey;
  const res = await fetch('/api/v2/notes/user_note', {
    method: 'POST',
    headers,
    body: JSON.stringify({ behavior_id })
  });

  if (res.ok) {
    return res.json();
  }

  const error = await res.json();
  throw new Error(error.message);
};

export const updateNote = async ({ queryKey }) => {
  const [, { data }] = queryKey;
  const res = await fetch('/api/v2/notes/update_note', {
    method: 'POST',
    headers,
    body: JSON.stringify({ data })
  });

  if (res.ok) {
    return res.json();
  }

  const error = await res.json();
  throw new Error(error.message);
};

export const fetchAllNotes = async () => {
  const res = await fetch('/api/v2/notes', {
    method: 'GET',
    headers
  });

  if (res.ok) {
    return res.json();
  }

  const error = await res.json();
  throw new Error(error.message);
};

export const fetchACFeaturedOptions = async () => {
  const res = await fetch(
    'https://admiredleadership.com/wp-json/acf/v3/options/options'
  );

  if (res.ok) {
    const data = await res.json();
    const { acf } = data;
    return acf;
  }
};

export const fetchEvent = async () => {
  const featuredOptions = await fetchACFeaturedOptions(); // Fetch the featured options
  const featuredEventID = featuredOptions.featured_event_lms; // Get the featured event ID
  let data = [];

  const res = await fetch(
    'https://admiredleadership.com/wp-json/wp/v2/events?&order_by=modified,date&order=desc'
  );

  if (res.ok) {
    data = await res.json();
  }

  for (const post of data) {
    if (post.id === featuredEventID) { // Use the fetched featured event ID
      return post;
    }
  }

  return null;
};

export const fetchContentData = async () => {
  const res = await fetch('/api/v2/courses');
  if (res.ok) {
    const data = await res.json();
    return data.data;
  }
};

export const fetchNoteContent = async ({ behaviorId }) => {
  const response = await fetch('/api/v2/notes/user_note', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      behavior_id: behaviorId
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  return data.note;
};

export const destroyNote = async ({ noteId }) => {
  const response = await fetch('/api/v2/notes/destroy_note', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: noteId
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  return data;
};

export async function updateUserWatchStatus({ behaviorId, status }) {
  const response = await fetch('/api/v2/users/watch', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      user_behavior: { behavior_id: behaviorId, status }
    })
  });

  if (!response.ok) {
    throw new Error('Error updating watch status');
  }

  return response.json();
}

export async function allUserHabits() {
  const response = await fetch('/api/v2/user_habits/all', {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    throw new Error('Error retreiving user habits');
  }

  return response.json();
}

export async function createOrDestroyUserHabit({ behaviorMapId }) {
  const response = await fetch('/api/v2/user_habits/create_or_destroy', {
    method: 'POST',
    headers,
    body: JSON.stringify({ behavior_map_id: behaviorMapId })
  });

  if (!response.ok) {
    throw new Error('Error creating user habit');
  }

  return response.json();
}

export async function setUserPhoneNumber({ phoneNumber }) {
  const response = await fetch('/api/v2/users/set_phone_number', {
    method: 'POST',
    headers,
    body: JSON.stringify({ phone_number: phoneNumber }),
  });

  if (!response.ok) {
    throw new Error('Error creating user habit');
  }

  return response.json();
}

export async function generateAndSendCode() {
  const response = await fetch(
    '/api/v2/users/generate_and_save_verification_code',
    {
      method: 'POST',
      headers,
    }
  );

  if (!response.ok) {
    throw new Error('Error creating user habit');
  }

  return response.json();
}

export async function confirmVerificationCode({ verificationCode }) {
  const response = await fetch('/api/v2/users/confirm_verification_code', {
    method: 'POST',
    headers,
    body: JSON.stringify({ verification_code: verificationCode }),
  });

  if (!response.ok) {
    throw new Error('Error creating user habit');
  }

  return response.json();
}

export async function getBehaviorHabits({ behaviorID }) {
  const response = await fetch('/api/v2/user_habits/behavior_maps', {
    method: 'POST',
    headers,
    body: JSON.stringify({ behaviorID }),
  });

  if (!response.ok) {
    throw new Error('Error fetching behavior habits');
  }

  return response.json();
}

export async function getUserFavoriteHabits() {
  const response = await fetch('/api/v2/user_habits/user_behavior_maps', {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Error fetching user favorite habits');
  }

  return response.json();
}

export async function getTimeZones() {
  const response = await fetch('/api/v2/users/time_zones', {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Error fetching user favorite habits');
  }

  return response.json();
}

export async function subscribeToH2H({
  behaviorID,
  timeZone,
  scheduledTime,
  startDate,
}) {
  const response = await fetch('/api/v2/users/subscribe_to_h2h', {
    method: 'POST',
    headers,
    body: JSON.stringify({ behaviorID, timeZone, scheduledTime, startDate }),
  });

  if (!response.ok) {
    throw new Error('Error fetching behavior habits');
  }

  return response.json();
}
