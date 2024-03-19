import { apiFetch } from './apiFetch';

export const getUserHabits = () => apiFetch({ url: '/api/v2/user_habits/all' });

export const getHabit = ({ habitId }) =>
  apiFetch({
    url: '/api/v2/user_habits/get_habit',
    method: 'POST',
    body: { habitId },
  });

export const getBehaviorMaps = (page = 1) =>
  apiFetch({
    url: `/api/v2/user_habits/behavior_maps?page=${page}`,
  });

export const getUserHabitsCategorized = () =>
  apiFetch({ url: '/api/v2/user_habits/categorized_user_habits' });

export const createOrDestroyUserHabit = ({ behaviorMapId }) =>
  apiFetch({
    url: '/api/v2/user_habits/create_or_destroy',
    method: 'POST',
    body: { behavior_map_id: behaviorMapId },
  });

export const getBehaviorHabits = ({ behaviorID }) =>
  apiFetch({
    url: '/api/v2/user_habits/behavior_maps',
    method: 'POST',
    body: { behaviorID },
  });

export const getUserFavoriteHabits = () =>
  apiFetch({
    url: '/api/v2/user_habits/user_behavior_maps',
  });