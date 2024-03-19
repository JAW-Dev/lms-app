import { csrfToken } from '@rails/ujs';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'X-CSRF-Token': csrfToken()
};

export async function apiFetch({ url, method = 'GET', body }) {
  const res = await fetch(url, {
    method,
    headers,
    body: body && typeof body === 'string' ? body : JSON.stringify(body)
  });

  return res.json();
}
