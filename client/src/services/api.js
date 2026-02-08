import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/update-password', data)
};

// Donor API
export const donorAPI = {
  getProfile: () => api.get('/donors/profile'),
  updateProfile: (data) => api.put('/donors/profile', data),
  getDashboard: () => api.get('/donors/dashboard'),
  getDonations: (params) => api.get('/donors/donations', { params }),
  getImpact: () => api.get('/donors/impact')
};

// Charity API
export const charityAPI = {
  getAll: (params) => api.get('/charities', { params }),
  getById: (id) => api.get(`/charities/${id}`),
  register: (data) => api.post('/charities/register', data),
  updateProfile: (data) => api.put('/charities/profile', data),
  getMyProfile: () => api.get('/charities/my/profile'),
  getMyDashboard: () => api.get('/charities/my/dashboard'),
  addProject: (data) => api.post('/charities/my/projects', data),
  addImpactReport: (data) => api.post('/charities/my/impact-report', data),
  getCauses: () => api.get('/charities/causes/list')
};

// Matching API
export const matchingAPI = {
  getRecommendations: (params) => api.get('/matching/recommendations', { params }),
  getQuick: (params) => api.get('/matching/quick', { params }),
  getSimilar: (charityId, params) => api.get(`/matching/similar/${charityId}`, { params }),
  calculateScore: (charityId) => api.post('/matching/score', { charityId }),
  getTrending: (params) => api.get('/matching/trending', { params }),
  getByCause: (cause, params) => api.get(`/matching/by-cause/${cause}`, { params }),
  getFilters: () => api.get('/matching/filters')
};

// Donation API
export const donationAPI = {
  create: (data) => api.post('/donations', data),
  getById: (id) => api.get(`/donations/${id}`),
  complete: (id, data) => api.put(`/donations/${id}/complete`, data),
  fail: (id, data) => api.put(`/donations/${id}/fail`, data),
  addFeedback: (id, data) => api.post(`/donations/${id}/feedback`, data),
  getReceipt: (id) => api.get(`/donations/receipt/${id}`),
  getPublicRecent: (params) => api.get('/donations/public/recent', { params })
};

// Payment API
export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verify: (data) => api.post('/payments/verify', data),
  quickDonate: (data) => api.post('/payments/quick-donate', data),
  getStatus: (orderId) => api.get(`/payments/status/${orderId}`),
  getConfig: () => api.get('/payments/config')
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getCharities: (params) => api.get('/admin/charities', { params }),
  verifyCharity: (id, data) => api.put(`/admin/charities/${id}/verify`, data),
  suspendCharity: (id, data) => api.put(`/admin/charities/${id}/suspend`, data),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, data) => api.put(`/admin/users/${id}/status`, data),
  getDonations: (params) => api.get('/admin/donations', { params }),
  flagDonation: (id, data) => api.put(`/admin/donations/${id}/flag`, data),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getFraudAlerts: () => api.get('/admin/fraud-alerts')
};
