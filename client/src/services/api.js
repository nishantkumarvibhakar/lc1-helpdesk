// Use environment variable if provided (e.g. on Vercel/Netlify), otherwise fallback to relative /api
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api';

function getHeaders(token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  const activeToken = token || localStorage.getItem('lc1_auth_token');
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = getHeaders(options.token);

  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  };

  try {
    const res = await fetch(url, config);
    const contentType = res.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text || `HTTP ${res.status} ${res.statusText}` };
      }
    }

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),

  // Tickets
  getTickets: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tickets${query ? `?${query}` : ''}`);
  },
  getMyTickets: () => request('/tickets/my'),
  getTicketById: (id) => request(`/tickets/${encodeURIComponent(id)}`),
  trackTicket: (ticketNumber) => request(`/tickets/track/${encodeURIComponent(ticketNumber)}`),
  createTicket: (payload) => request('/tickets', { method: 'POST', body: JSON.stringify(payload) }),
  updateTicketStatus: (id, status, note) => request(`/tickets/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status, note }) }),
  updateTicketFull: (id, payload) => request(`/tickets/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  assignTicket: (id, assignedTo) => request(`/tickets/${encodeURIComponent(id)}/assign`, { method: 'PATCH', body: JSON.stringify({ assignedTo }) }),
  addTicketMessage: (id, payload) => request(`/tickets/${encodeURIComponent(id)}/messages`, { method: 'POST', body: JSON.stringify(payload) }),
  deleteTicket: (id) => request(`/tickets/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Notices & Announcements / Events
  getNotices: () => request('/notices'),
  getNoticeById: (id) => request(`/notices/${encodeURIComponent(id)}`),
  createNotice: (payload) => request('/notices', { method: 'POST', body: JSON.stringify(payload) }),
  updateNotice: (id, payload) => request(`/notices/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteNotice: (id) => request(`/notices/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // FAQs
  getFaqs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/faqs${query ? `?${query}` : ''}`);
  },
  createFaq: (payload) => request('/faqs', { method: 'POST', body: JSON.stringify(payload) }),
  updateFaq: (id, payload) => request(`/faqs/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteFaq: (id) => request(`/faqs/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Team
  getTeam: () => request('/team'),
  createTeamMember: (payload) => request('/team', { method: 'POST', body: JSON.stringify(payload) }),
  updateTeamMember: (id, payload) => request(`/team/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteTeamMember: (id) => request(`/team/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Manifesto
  getManifesto: () => request('/manifesto'),
  createManifestoPoint: (payload) => request('/manifesto', { method: 'POST', body: JSON.stringify(payload) }),
  updateManifestoPoint: (id, payload) => request(`/manifesto/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteManifestoPoint: (id) => request(`/manifesto/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Upload to Cloudinary
  uploadFile: async (file, folder = 'lc1_helpdesk') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    const activeToken = localStorage.getItem('lc1_auth_token');
    const headers = {};
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }
    
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Upload failed with status ${res.status}`);
    }
    
    return await res.json();
  },
  getUploadStatus: () => request('/upload/status'),

  // Stats
  getStats: () => request('/stats')
};
