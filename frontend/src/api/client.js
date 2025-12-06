const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const buildUrl = (path, params) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .forEach(([key, value]) => url.searchParams.append(key, value));
  }
  return url.toString();
};

export async function apiRequest(path, { method = 'GET', data, token, params, signal } = {}) {
  const url = buildUrl(path, params);
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    signal
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const message = payload?.error || payload?.message || 'Une erreur est survenue';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

export { API_BASE_URL };
