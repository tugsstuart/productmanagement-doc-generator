import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiClient = {
  // Get all templates
  getTemplates: async () => {
    const response = await api.get('/api/generate/templates');
    return response.data;
  },

  // Get specific template
  getTemplate: async (type) => {
    const response = await api.get(`/api/generate/template/${type}`);
    return response.data;
  },

  // Generate document
  generateDocument: async (data) => {
    const response = await api.post('/api/generate', data);
    return response.data;
  },

  // Export document
  exportDocument: async (data) => {
    const response = await api.post('/api/export', data, {
      responseType: 'blob',
    });
    return response;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
