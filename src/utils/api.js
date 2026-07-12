import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost/shreenovatech/backend/api';

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('snt_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// ── Public APIs ──────────────────────────────────────────────
export const getPricing      = ()       => api.get('/pricing');
export const getPortfolio    = (cat='') => api.get('/portfolio' + (cat ? `?category=${cat}` : ''));
export const getTestimonials = ()       => api.get('/testimonials');
export const getFaqs         = (cat='') => api.get('/faq' + (cat ? `?category=${cat}` : ''));
export const getStats        = ()       => api.get('/stats');
export const getSettings     = (grp='') => api.get('/settings' + (grp ? `?group=${grp}` : ''));
export const getSeoPage      = (slug)   => api.get(`/seo/${slug}`);
export const getHosting      = (type='') => api.get('/hosting' + (type ? `?type=${type}` : ''));

// ── Submit forms ─────────────────────────────────────────────
export const submitContact   = (data)   => api.post('/contact', data);
export const submitBooking   = (data)   => api.post('/bookings', data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
});
export const submitPayment   = (data)   => api.post('/payments', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const subscribeNewsletter = (email) => api.post('/newsletter', { email });
export const trackVisit      = (page)   => api.post('/track', { page, referrer: document.referrer });

// ── Admin Auth ───────────────────────────────────────────────
export const adminLogin      = (data)   => api.post('/auth/login', data);
export const adminLogout     = ()       => api.post('/auth/logout');
export const adminMe         = ()       => api.get('/auth/me');
export const forgotPassword  = (email)  => api.post('/auth/forgot', { email });
export const resetPassword   = (data)   => api.post('/auth/reset', data);

// ── Admin Dashboard ──────────────────────────────────────────
export const getDashboard    = ()       => api.get('/dashboard');

// ── Admin Bookings ───────────────────────────────────────────
export const getBookings     = (params='') => api.get(`/bookings?${params}`);
export const getBooking      = (id)        => api.get(`/bookings/${id}`);
export const updateBookingStatus = (id, status, notes='') => api.put(`/bookings/${id}/status`, { status, admin_notes: notes });
export const deleteBooking   = (id)        => api.delete(`/bookings/${id}`);

// ── Admin Payments ───────────────────────────────────────────
export const getPayments     = (params='') => api.get(`/payments?${params}`);
export const getPayment      = (id)        => api.get(`/payments/${id}`);
export const updatePaymentStatus = (id, status, notes='') => api.put(`/payments/${id}/status`, { status, admin_notes: notes });
export const deletePayment   = (id)        => api.delete(`/payments/${id}`);

// ── Admin Contacts ───────────────────────────────────────────
export const getContacts     = (params='') => api.get(`/contact?${params}`);
export const getContact      = (id)        => api.get(`/contact/${id}`);
export const replyContact    = (id, reply) => api.put(`/contact/${id}/reply`, { reply });
export const updateContactStatus = (id, status) => api.put(`/contact/${id}`, { status });
export const deleteContact   = (id)        => api.delete(`/contact/${id}`);

// ── Admin Portfolio ──────────────────────────────────────────
export const createPortfolio = (data)   => api.post('/portfolio', data);
export const updatePortfolio = (id, d)  => api.put(`/portfolio/${id}`, d);
export const deletePortfolio = (id)     => api.delete(`/portfolio/${id}`);

// ── Admin Pricing ────────────────────────────────────────────
export const updatePricing   = (id, d)  => api.put(`/pricing/${id}`, d);

// ── Admin Testimonials ───────────────────────────────────────
export const createTestimonial = (d)    => api.post('/testimonials', d);
export const updateTestimonial = (id,d) => api.put(`/testimonials/${id}`, d);
export const deleteTestimonial = (id)   => api.delete(`/testimonials/${id}`);

// ── Admin FAQs ───────────────────────────────────────────────
export const createFaq       = (d)      => api.post('/faq', d);
export const updateFaq       = (id, d)  => api.put(`/faq/${id}`, d);
export const deleteFaq       = (id)     => api.delete(`/faq/${id}`);

// ── Admin Settings ───────────────────────────────────────────
export const updateSettings  = (data)   => api.put('/settings', data);

// ── Admin Stats ──────────────────────────────────────────────
export const updateStat      = (id, d)  => api.put(`/stats/${id}`, d);

// ── Admin SEO ────────────────────────────────────────────────
export const updateSeo       = (slug,d) => api.put(`/seo/${slug}`, d);

// ── Admin Blog ───────────────────────────────────────────────
export const getBlogs        = (params='') => api.get(`/blog?${params}`);
export const getBlog         = (id)        => api.get(`/blog/${id}`);
export const createBlog      = (d)         => api.post('/blog', d);
export const updateBlog      = (id, d)     => api.put(`/blog/${id}`, d);
export const deleteBlog      = (id)        => api.delete(`/blog/${id}`);

// ── Admin Media ──────────────────────────────────────────────
export const getMedia        = (folder='') => api.get(`/media?folder=${folder}`);
export const uploadMedia     = (formData)  => api.post('/media', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteMedia     = (id)        => api.delete(`/media/${id}`);

// ── Admin Users ──────────────────────────────────────────────
export const getUsers        = ()       => api.get('/users');
export const createUser      = (d)      => api.post('/users', d);
export const updateUser      = (id, d)  => api.put(`/users/${id}`, d);
export const deleteUser      = (id)     => api.delete(`/users/${id}`);

// ── Admin Hosting ────────────────────────────────────────────
export const createHosting   = (d)      => api.post('/hosting', d);
export const updateHosting   = (id, d)  => api.put(`/hosting/${id}`, d);
export const deleteHosting   = (id)     => api.delete(`/hosting/${id}`);

export default api;
