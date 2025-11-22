import axios from 'axios';

// API URLs from environment variables or defaults
const API_BASE_URL_A = process.env.REACT_APP_API_URL_A || 'http://localhost:5000/api';
const API_BASE_URL_B = process.env.REACT_APP_API_URL_B || 'http://localhost:5001/api';
const API_BASE_URL_C = process.env.REACT_APP_API_URL_C || 'http://localhost:5002/api';

// Member A API (Catalog & Member Profiles)
const apiA = axios.create({
  baseURL: API_BASE_URL_A,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Member B API (Lending & Return Logic)
const apiB = axios.create({
  baseURL: API_BASE_URL_B,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Member C API (Dashboard & Reporting)
const apiC = axios.create({
  baseURL: API_BASE_URL_C,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Members API (Member A)
export const membersAPI = {
  getAll: () => apiA.get('/members'),
  getById: (id) => apiA.get(`/members/${id}`),
  create: (memberData) => apiA.post('/members', memberData),
};

// Items API (Member A)
export const itemsAPI = {
  getAll: (params) => apiA.get('/items', { params }),
  getById: (id) => apiA.get(`/items/${id}`),
  create: (itemData) => apiA.post('/items', itemData),
  update: (id, itemData) => apiA.put(`/items/${id}`, itemData),
};

// Loans API (Member B)
export const loansAPI = {
  borrow: (loanData) => apiB.post('/loans/borrow', loanData),
  return: (loanId) => apiB.post('/loans/return', { loanId }),
  getAll: (params) => apiB.get('/loans', { params }),
  getById: (id) => apiB.get(`/loans/${id}`),
  getAvailableItems: () => apiB.get('/loans/available/items'),
  getBorrowedByMember: (memberId) => apiB.get(`/loans/borrowed/by/${memberId}`),
};

// Dashboard API (Member C)
export const dashboardAPI = {
  getOverdue: () => apiC.get('/dashboard/overdue'),
  getStats: () => apiC.get('/dashboard/stats'),
  getCurrentBorrows: (params) => apiC.get('/dashboard/current-borrows', { params }),
  getNotifications: () => apiC.get('/dashboard/notifications'),
};

// Loan History API (Member C)
export const loanHistoryAPI = {
  getHistory: (params) => apiC.get('/loans/history', { params }),
};

export default { apiA, apiB, apiC };

