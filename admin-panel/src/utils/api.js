import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE, timeout: 30000 });

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

// Auth
export const login  = d  => api.post('/auth/login', d);
export const logout = () => api.post('/auth/logout');
export const getMe  = () => api.get('/auth/me');

// Dashboard
export const getDashboard = () => api.get('/dashboard');

// Notifications
export const getNotifications = () => api.get('/notifications');
export const markNotifRead    = id => api.put(`/notifications/${id}`);
export const markAllRead      = () => api.put('/notifications/read-all');
export const deleteNotif      = id => api.delete(`/notifications/${id}`);

// Bookings
export const getBookings         = p  => api.get(`/bookings?${p || ''}`);
export const getBooking          = id => api.get(`/bookings/${id}`);
export const updateBookingStatus = (id, status, notes) => api.put(`/bookings/${id}/status`, { status, admin_notes: notes });
export const deleteBooking       = id => api.delete(`/bookings/${id}`);

// Contacts
export const getContacts         = p  => api.get(`/contact?${p || ''}`);
export const getContact          = id => api.get(`/contact/${id}`);
export const replyContact        = (id, reply) => api.put(`/contact/${id}/reply`, { reply });
export const updateContactStatus = (id, status) => api.put(`/contact/${id}`, { status });
export const deleteContact       = id => api.delete(`/contact/${id}`);

// Payments
export const getPayments         = p  => api.get(`/payments?${p || ''}`);
export const getPayment          = id => api.get(`/payments/${id}`);
export const updatePaymentStatus = (id, status, notes) => api.put(`/payments/${id}/status`, { status, admin_notes: notes });
export const approvePayment      = (id, notes) => api.post(`/payments/${id}/approve`, { admin_notes: notes || '' });
export const rejectPayment       = (id, notes) => api.post(`/payments/${id}/reject`,  { admin_notes: notes || '' });
export const deletePayment       = id => api.delete(`/payments/${id}`);

// Portfolio
export const getPortfolios  = p  => api.get(`/portfolio?all=1&${p || ''}`);
export const getPortfolio   = id => api.get(`/portfolio/${id}`);
export const createPortfolio = d => api.post('/portfolio', d);
export const updatePortfolio = (id, d) => api.put(`/portfolio/${id}`, d);
export const deletePortfolio = id => api.delete(`/portfolio/${id}`);

// Pricing
export const getPricings   = () => api.get('/pricing?all=1');
export const getPricing    = id => api.get(`/pricing/${id}`);
export const createPricing = d  => api.post('/pricing', d);
export const updatePricing = (id, d) => api.put(`/pricing/${id}`, d);
export const deletePricing = id => api.delete(`/pricing/${id}`);

// Testimonials
export const getTestimonials   = () => api.get('/testimonials?all=1');
export const createTestimonial = d  => api.post('/testimonials', d);
export const updateTestimonial = (id, d) => api.put(`/testimonials/${id}`, d);
export const deleteTestimonial = id => api.delete(`/testimonials/${id}`);

// FAQs
export const getFaqs   = () => api.get('/faq');
export const createFaq = d  => api.post('/faq', d);
export const updateFaq = (id, d) => api.put(`/faq/${id}`, d);
export const deleteFaq = id => api.delete(`/faq/${id}`);

// Hosting
export const getHostings   = () => api.get('/hosting?all=1');
export const createHosting = d  => api.post('/hosting', d);
export const updateHosting = (id, d) => api.put(`/hosting/${id}`, d);
export const deleteHosting = id => api.delete(`/hosting/${id}`);

// Blog
export const getBlogs   = p  => api.get(`/blog?all=1&${p || ''}`);
export const getBlog    = id => api.get(`/blog/${id}`);
export const createBlog = d  => api.post('/blog', d);
export const updateBlog = (id, d) => api.put(`/blog/${id}`, d);
export const deleteBlog = id => api.delete(`/blog/${id}`);

// Media
export const getMedia    = p  => api.get(`/media?${p || ''}`);
export const uploadMedia = d  => api.post('/media', d, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteMedia = id => api.delete(`/media/${id}`);

// SEO
export const getSeoSettings    = () => api.get('/settings?group=seo');
export const updateSeoSettings = d  => api.put('/settings', d);

// Users
export const getUsers    = () => api.get('/users');
export const getUser     = id => api.get(`/users/${id}`);
export const createUser  = d  => api.post('/users', d);
export const updateUser  = (id, d) => api.put(`/users/${id}`, d);
export const deleteUser  = id => api.delete(`/users/${id}`);

// Settings
export const getSettings    = () => api.get('/settings');
export const updateSettings = d  => api.put('/settings', d);

export default api;
