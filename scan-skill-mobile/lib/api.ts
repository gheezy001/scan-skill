import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// IP de ton PC sur le hotspot iPhone — à changer si l'IP change
//const API_URL = 'http://192.168.137.1:8000';
const API_URL = 'https://scan-skill-backend-umj7.onrender.com';

export const api = axios.create({ 
  baseURL: `${API_URL}/api`,
  timeout: 120000,
});

export const publicApi = axios.create({ 
  baseURL: `${API_URL}/api`,
  timeout: 120000,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

export const auth = {
  async saveToken(token: string) {
    await SecureStore.setItemAsync('token', token);
  },
  async getToken() {
    return SecureStore.getItemAsync('token');
  },
  async saveUser(user: any) {
    await SecureStore.setItemAsync('user', JSON.stringify(user));
  },
  async getUser() {
    const raw = await SecureStore.getItemAsync('user');
    return raw ? JSON.parse(raw) : null;
  },
  async logout() {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
  },
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const verifyApi = {
  check: (code: string) => publicApi.get(`/verify/${code}`),
  analyze: (type: string, entity: any) =>
    publicApi.post('/ai-analysis', { type, entity }),
};

export const ouvriersApi = {
  getAll: (params?: any) => api.get('/ouvriers', { params }),
  getOne: (id: string) => api.get(`/ouvriers/${id}`),
};

export const enginsApi = {
  getAll: (params?: any) => api.get('/engins', { params }),
  getOne: (id: string) => api.get(`/engins/${id}`),
};

export const appareilsApi = {
  getAll: (params?: any) => api.get('/appareils', { params }),
};

export const statsApi = {
  dashboard: () => api.get('/stats/dashboard'),
};