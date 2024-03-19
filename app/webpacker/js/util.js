import { useState, useEffect } from "react";

export const fetchStatus = (resp) => {
  if (!resp.ok) {
    const error = new Error(resp.statusText);
    throw error;
  }
  return resp;
};

export const emailIsValid = (email) => /\S+@\S+\.\S+/.test(email);

export const showNotice = (msg) => {
  document.dispatchEvent(new CustomEvent("hideNotice"));

  const noticeEvent = new CustomEvent("showNotice", {
    detail: msg,
  });
  document.dispatchEvent(noticeEvent);
};

export const showAlert = (msg) => {
  document.dispatchEvent(new CustomEvent("hideNotice"));

  const alertEvent = new CustomEvent("showAlert", {
    detail: msg,
  });
  document.dispatchEvent(alertEvent);
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};
