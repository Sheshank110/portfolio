const rawApiBase = import.meta.env.VITE_API_URL || '/api';
const API_BASE = rawApiBase.replace(/\/+$/, '');

/**
 * Submit contact form data to the backend.
 */
export async function submitContact({ name, email, message }) {
  const response = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
}
