import { apiFetch } from './apiFetch';

export const getProgresses = () =>
  apiFetch({
    url: '/api/v2/help_to_habits/get_progresses',
  });

export const getUsersProgresses = () =>
  apiFetch({
    url: '/api/v2/help_to_habits/get_users_progresses',
  });

export const getLatestCompletedBehaviorWithBehaviorMaps = () =>
  apiFetch({
    url: '/api/v2/help_to_habits/latest_completed_with_behavior_maps',
  });

export const deleteHelpToHabitProgresses = (progressIds) =>
  apiFetch({
    url: '/api/v2/help_to_habits/delete_progresses',
    method: 'POST',
    body: { progress_ids: progressIds },
  });

export const scheduleHabit = ({ progressId, selectedDay }) =>
  apiFetch({
    url: '/api/v2/help_to_habits/schedule_habit',
    method: 'POST',
    body: { progress_id: progressId, selected_day: selectedDay },
  });

export const toggleProgress = ({ progressId, is_active }) =>
  apiFetch({
    url: `/api/v2/help_to_habit_progresses/${progressId}`,
    method: "PATCH",
    body: {
      help_to_habit_progress: {
        is_active
      }
    }
  });
