import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE, timeout: 15000 });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('snt_admin_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('snt_admin_token');
      localStorage.removeItem('snt_admin_user');
      window.location.href = '/admin/';
    }
    return Promise.reject(err);
  }
);

export const login         = d  => api.post('/auth/login', d);
export const logout        = () => api.post('/auth/logout');
export const getMe         = () => api.get('/auth/me');

export const getDashboard  = () => api.get('/dashboard');
export const getNotifications = () => api.get('/notifications');
export const markNotifRead = id => api.put(`/notifications/${id}`);
export const markAllRead   = () => api.put('/notifications/read-all');
export const deleteNotif   = id => api.delete(`/notifications/${id}`);

export const getBookings   = p  => api.get(`/bookings?${p || ''}`);
export const getBooking    = id => api.get(`/bookings/${id}`);
export const updateBookingStatus = (id, status, notes) => api.put(`/bookings/${id}/status`, { status, admin_notes: notes });
export const deleteBooking = id => api.delete(`/bookings/${id}`);

export const getContacts   = p  => api.get(`/contact?${p || ''}`);
export const getContact    = id => api.get(`/contact/${id}`);
export const replyContact  = (id, reply) => api.put(`/contact/${id}/reply`, { reply });
export const updateContactStatus = (id, status) => api.put(`/contact/${id}`, { status });
export const deleteContact = id => api.delete(`/contact/${id}`);

export const getPayments   = p  => api.get(`/payments?${p || ''}`);
export const getPayment    = id => api.get(`/payments/${id}`);
export const updatePaymentStatus = (id, status, notes) => api.put(`/payments/${id}/status`, { status, admin_notes: notes });
export const deletePayment = id => api.delete(`/payments/${id}`);

export const getUsers      = () => api.get('/users');
export const createUser    = d  => api.post('/users', d);
export const updateUser    = (id, d) => api.put(`/users/${id}`, d);
export const deleteUser    = id => api.delete(`/users/${id}`);

export const getSettings   = () => api.get('/settings');
export const updateSettings = d => api.put('/settings', d);

export default api;
