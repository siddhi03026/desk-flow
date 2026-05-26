import axios from 'axios';

const normalizeUrl = (url) => url.replace(/\/+$/, '');

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return normalizeUrl(import.meta.env.VITE_API_URL);
  }
  // Fallback to Render URL in production
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    return 'https://desk-flow-32bo.onrender.com';
  }
  return 'http://localhost:5000';
};

export const API_URL = getApiUrl();

const api = axios.create({
  baseURL: `${API_URL}/tickets`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. The server may be waking up — please retry.';
    } else if (!error.response) {
      error.message = 'Cannot reach the server. Please check your connection.';
    }
    return Promise.reject(error);
  }
);

export const getTickets = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.breached !== undefined && filters.breached !== '') params.append('breached', filters.breached);
  
  const response = await api.get(`?${params.toString()}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const createTicket = async (ticketData) => {
  const response = await api.post('/', ticketData);
  return response.data;
};

export const updateTicketStatus = async (id, status) => {
  const response = await api.patch(`/${id}`, { status });
  return response.data;
};

export const deleteTicket = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    return response.data.status === 'ok';
  } catch {
    return false;
  }
};
