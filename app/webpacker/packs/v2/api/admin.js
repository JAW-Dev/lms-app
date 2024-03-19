import { apiFetch } from "./apiFetch";

export const getUsers = ({ queryKey }) => {
  const [, { page, search, confirmed, count }] = queryKey;
  return apiFetch({
    url: "/api/v2/admin/users/users",
    method: "POST",
    body: { page, search, confirmed, count },
  });
};

export const getUserInvites = ({ queryKey }) => {
  const [, { page, search }] = queryKey;
  return apiFetch({
    url: "/api/v2/admin/users/user_invites",
    method: "POST",
    body: { page, search },
  });
};

export const updateUser = (serializedData) =>
  apiFetch({
    url: "/api/v2/admin/users/update_user",
    method: "POST",
    body: serializedData,
  });

export const inviteUsers = (serializedData) =>
  apiFetch({
    url: "/api/v2/admin/users/invite_users",
    method: "POST",
    body: serializedData,
  });

export const getInvitationData = () =>
  apiFetch({
    url: "/api/v2/admin/users/invitation_data",
  });

export const destroyInvites = (serializedData) =>
  apiFetch({
    url: "/api/v2/admin/users/destroy_invites",
    method: "POST",
    body: serializedData,
  });

export const destroyUsers = (serializedData) =>
  apiFetch({
    url: "/api/v2/admin/users/destroy_users",
    method: "POST",
    body: serializedData,
  });

export const destroyInvitationOrUsers = (serializedData, type) => {
  if (type === "users") {
    return destroyUsers(serializedData);
  }
  if (type === "invites") {
    return destroyInvites(serializedData);
  }
};

export const resendInvites = (serializedData) =>
  apiFetch({
    url: "/api/v2/admin/users/resend_invites",
    method: "POST",
    body: serializedData,
  });

export function getBehaviors() {
  return apiFetch({
    url: "/api/v2/admin/behaviors/get_behaviors",
  });
}

export function getBehavior({ behaviorID }) {
  return apiFetch({
    url: `/api/v2/admin/behaviors/${behaviorID}.json`,
    method: "GET"
  });
}

export async function updateBehavior({ data: curriculum_behavior, behaviorID }) {
  return apiFetch({
    url: `/api/v2/admin/behaviors/${behaviorID}`,
    method: "PATCH",
    body: {
      curriculum_behavior,
    },
  });
}

export function updateHabitOrder(habits) {
  return apiFetch({
    url: "/api/v2/admin/help_to_habits/update_order",
    method: "POST",
    body: {
      help_to_habit: {
        reorder: habits
      }
    },
  })
}

export async function getCourses() {
  return apiFetch({
    url: "/api/v2/admin/courses/get_courses",
  });
}

export async function createNew({ data, behaviorID }) {
  return apiFetch({
    url: "/api/v2/admin/help_to_habits/create_new",
    method: "POST",
    body: {
      data,
      behavior_id: behaviorID,
    },
  });
}

export async function deleteHelpToHabit({ helpToHabitID }) {
  return apiFetch({
    url: "/api/v2/admin/help_to_habits/delete_help_to_habit",
    method: "POST",
    body: {
      help_to_habit_id: helpToHabitID,
    },
  });
}

export async function editHelpToHabit({ data: help_to_habit, helpToHabitID }) {
  return apiFetch({
    url: `/api/v2/admin/help_to_habits/${helpToHabitID}`,
    method: "PATCH",
    body: {
      help_to_habit,
    },
  });
}

export async function editHelpToHabitExtra({ data: help_to_habit_extra, behaviorId, extraId }) {
  const method = extraId ? "PATCH" : "POST";
  let url = `/api/v2/admin/behaviors/${behaviorId}/help_to_habit_extras`
  if(extraId) {
    url = `${url}/${extraId}`
  }
  return apiFetch({
    url,
    method,
    body: {
      help_to_habit_extra,
    },
  });
}
