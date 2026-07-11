const API = 'http://localhost/shreenovatech/backend/api';

// ── Auth ──────────────────────────────────────────────────────
function getToken() { return localStorage.getItem('snt_token'); }
function getUser()  { try { return JSON.parse(localStorage.getItem('snt_user')||'{}'); } catch { return {}; } }

function requireAuth() {
  if (!getToken()) { window.location.href = 'login.html'; return false; }
  return true;
}

function logout() {
  apiFetch('/auth/logout', { method:'POST' }).catch(()=>{});
  localStorage.removeItem('snt_token');
  localStorage.removeItem('snt_user');
  window.location.href = 'login.html';
}

// ── API Fetch ─────────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options.body instanceof FormData) delete headers['Content-Type'];

  const res = await fetch(API + endpoint, { ...options, headers });
  if (res.status === 401) { logout(); return null; }
  return res.json();
}

// ── Sidebar Toggle ────────────────────────────────────────────
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main    = document.getElementById('mainContent');
  const toggle  = document.getElementById('sidebarToggle');
  if (!sidebar) return;

  const collapsed = localStorage.getItem('snt_sidebar') === '1';
  if (collapsed) { sidebar.classList.add('collapsed'); main?.classList.add('expanded'); }

  toggle?.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    main?.classList.toggle('expanded');
    localStorage.setItem('snt_sidebar', sidebar.classList.contains('collapsed') ? '1' : '0');
  });

  // Set active nav item
  const page = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.dataset.page === page) el.classList.add('active');
  });

  // Fill user info
  const user = getUser();
  const initials = (user.full_name || user.username || 'A').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  document.querySelectorAll('.user-initials').forEach(el => el.textContent = initials);
  document.querySelectorAll('.user-name').forEach(el => el.textContent = user.full_name || user.username || 'Admin');
  document.querySelectorAll('.user-role').forEach(el => el.textContent = user.role || 'admin');
}

// ── Toast Notification ────────────────────────────────────────
function toast(msg, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  const colors = { success:'#f0fdf4;border:1px solid #bbf7d0;color:#15803d', error:'#fef2f2;border:1px solid #fecaca;color:#dc2626', info:'#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8' };
  t.style.cssText = `background:${colors[type]||colors.success};padding:12px 18px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,.12);animation:slideIn .3s ease;max-width:320px`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ── Modal helpers ─────────────────────────────────────────────
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// ── Format helpers ────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function fmtDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}
function fmtCurrency(n) {
  return '₹' + Number(n||0).toLocaleString('en-IN');
}

function statusBadge(status) {
  const map = {
    new:'badge-blue', pending:'badge-yellow', contacted:'badge-blue',
    in_progress:'badge-purple', completed:'badge-green', cancelled:'badge-red',
    verified:'badge-green', rejected:'badge-red', read:'badge-gray', replied:'badge-green',
    published:'badge-green', draft:'badge-yellow', archived:'badge-gray',
  };
  return `<span class="badge ${map[status]||'badge-gray'}">${status?.replace(/_/g,' ')}</span>`;
}

// ── Confirm dialog ────────────────────────────────────────────
function confirmDelete(msg = 'Are you sure you want to delete this?') {
  return window.confirm(msg);
}

// ── Pagination renderer ───────────────────────────────────────
function renderPagination(containerId, pagination, onPage) {
  const el = document.getElementById(containerId);
  if (!el || !pagination) return;
  const { current_page, last_page } = pagination;
  let html = '';
  html += `<button class="page-btn" ${current_page<=1?'disabled':''} onclick="(${onPage})(${current_page-1})">‹</button>`;
  for (let i = Math.max(1,current_page-2); i <= Math.min(last_page,current_page+2); i++) {
    html += `<button class="page-btn ${i===current_page?'active':''}" onclick="(${onPage})(${i})">${i}</button>`;
  }
  html += `<button class="page-btn" ${current_page>=last_page?'disabled':''} onclick="(${onPage})(${current_page+1})">›</button>`;
  el.innerHTML = html;
}

// ── Init on load ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  initSidebar();
});

// CSS animation
const style = document.createElement('style');
style.textContent = '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';
document.head.appendChild(style);
