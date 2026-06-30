import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({ baseURL: `${API_URL}/api` });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/se-connecter';
    }
    return Promise.reject(err);
  },
);


// Client public (scan terrain, sans authentification ni redirection login)
export const publicApi = axios.create({ baseURL: `${API_URL}/api` });

// Vérification publique d'un QR code
export const verifyApi = {
  check: (code: string) => publicApi.get(`/verify/${code}`),
  analyze: (type: string, entity: any) => publicApi.post('/ai-analysis', { type, entity }),
};

// Auth
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

// Ouvriers
export const ouvriersApi = {
  getAll: (params?: any) => api.get('/ouvriers', { params }),
  getOne: (id: string) => api.get(`/ouvriers/${id}`),
  create: (data: any) => api.post('/ouvriers', data),
  update: (id: string, data: any) => api.put(`/ouvriers/${id}`, data),
  delete: (id: string) => api.delete(`/ouvriers/${id}`),
  addHabilitation: (id: string, data: any) => api.post(`/ouvriers/${id}/habilitations`, data),
  updateHabilitation: (id: string, data: any) => api.put(`/ouvriers/habilitations/${id}`, data),
  deleteHabilitation: (id: string) => api.delete(`/ouvriers/habilitations/${id}`),
  getAllHabilitations: () => api.get('/ouvriers/all/habilitations'),
  getExpiring: (days?: number) => api.get('/ouvriers/expiring', { params: { days } }),
};

// Engins
export const enginsApi = {
  getAll: (params?: any) => api.get('/engins', { params }),
  getOne: (id: string) => api.get(`/engins/${id}`),
  create: (data: any) => api.post('/engins', data),
  update: (id: string, data: any) => api.put(`/engins/${id}`, data),
  delete: (id: string) => api.delete(`/engins/${id}`),
};

// Appareils
export const appareilsApi = {
  getAll: (params?: any) => api.get('/appareils', { params }),
  getOne: (id: string) => api.get(`/appareils/${id}`),
  create: (data: any) => api.post('/appareils', data),
  update: (id: string, data: any) => api.put(`/appareils/${id}`, data),
  delete: (id: string) => api.delete(`/appareils/${id}`),
};

// Types habilitations
export const habTypesApi = {
  getAll: () => api.get('/habilitation-types'),
  create: (data: any) => api.post('/habilitation-types', data),
  update: (id: string, data: any) => api.put(`/habilitation-types/${id}`, data),
  delete: (id: string) => api.delete(`/habilitation-types/${id}`),
};

// Stats
export const statsApi = {
  dashboard: () => api.get('/stats/dashboard'),
};

// Import
export const importApi = {
  ouvriers: (content: string) => api.post('/import/ouvriers', { content }),
  habilitations: (content: string) => api.post('/import/habilitations', { content }),
  engins: (content: string) => api.post('/import/engins', { content }),
};

// AI Analysis
export const aiApi = {
  analyze: (type: string, entity: any) => api.post('/ai-analysis', { type, entity }),
};
