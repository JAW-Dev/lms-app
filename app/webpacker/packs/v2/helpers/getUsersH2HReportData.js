import { csrfToken } from "@rails/ujs";
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
  "X-CSRF-Token": csrfToken(),
};

const getUsersH2HReportData = async () => {
  const res = await fetch("/api/v2/help_to_habits/get_users_progresses", {
    method: "GET",
    headers
  });

  const result = await res.json();

  return result;
};

export default getUsersH2HReportData;
