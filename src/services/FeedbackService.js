const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || body.error || `Request failed with status ${response.status}`);
  }
  return body;
}

export async function fetchFeedbacks(params = {}) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  }
  const query = searchParams.toString();
  const res = await request(query ? `/feedback?${query}` : '/feedback');
  return res.data ?? [];
}

export async function submitFeedback(payload) {
  const res = await request('/feedback', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function removeFeedback(id) {
  return request(`/feedback/${id}`, { method: 'DELETE' });
}
