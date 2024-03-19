import { apiFetch } from "./apiFetch";

export const getNote = ({ queryKey }) => {
  const [, { behavior_id }] = queryKey;
  return apiFetch({
    url: "/api/v2/notes/user_note",
    method: "POST",
    body: { behavior_id },
  });
};

export const getAllNotes = () =>
  apiFetch({
    url: "/api/v2/notes",
  });

export const getNoteContent = ({ behaviorId }) =>
  apiFetch({
    url: "/api/v2/notes/user_note",
    method: "POST",
    body: { behavior_id: behaviorId },
  });

export const destroyNote = ({ noteId }) => {
  if (!noteId) {
    return;
  }

  return apiFetch({
    url: "/api/v2/notes/destroy_note",
    method: "POST",
    body: { id: noteId },
  });
};
