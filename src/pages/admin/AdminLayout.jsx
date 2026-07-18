import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './admin.css';

const NAV = [
  { section: 'Main' },
  { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { section: 'Management' },
  { path: '/admin/bookings',  icon: '📋', label: 'Bookings' },
  { path: '/admin/payments',  icon: '💳', label: 'Payments' },
  { path: '/admin/contacts',  icon: '✉️', label: 'Contacts' },
  { section: 'Website' },
  { path: '/admin/portfolio', icon: '🖼️', label: 'Portfolio' },
  { path: '/admin/pricing',   icon: '💰', label: 'Pricing' },
  { path: '/admin/settings',  icon: '⚙️', label: 'Settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const token = localStorage.getItem('snt_token');
  const user  = (() => { try { return JSON.parse(localStorage.getItem('snt_user') || '{}'); } catch { return {}; } })();

  useEffect(() => {
    if (!token) navigate('/admin/login', { replace: true });
  }, [token, navigate]);

  if (!token) return null;

  const initials = (user.full_name || user.username || 'A')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  function logout() {
    localStorage.removeItem('snt_token');
    localStorage.removeItem('snt_user');
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="adm-layout">
      <aside className={`adm-sidebar${collapsed ? ' collapsed' : ''}`}>
        <div className="adm-logo">
          <img src="/logo.png" alt="SNT" onError={e => e.target.style.display = 'none'} />
          {!collapsed && <span>ShreeNova Tech</span>}
        </div>
        <nav className="adm-nav">
          {NAV.map((item, i) =>
            item.section
              ? <div key={i} className="adm-nav-section">{!collapsed && item.section}</div>
              : <NavLink key={item.path} to={item.path}
                  className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}>
                  <span className="adm-nav-icon">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
          )}
        </nav>
        <div className="adm-sidebar-footer">
          <div className="adm-avatar">{initials}</div>
          {!collapsed && (
            <div className="adm-user-info">
              <strong>{user.full_name || user.username || 'Admin'}</strong>
              <small>{user.role || 'admin'}</small>
            </div>
          )}
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button className="adm-toggle" onClick={() => setCollapsed(c => !c)}>☰</button>
            <span className="adm-page-title">Admin Panel</span>
          </div>
          <div className="adm-topbar-right">
            <a href="/" target="_blank" className="adm-btn adm-btn-outline adm-btn-sm">🌐 View Site</a>
            <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={logout}>🚪 Logout</button>
            <div className="adm-avatar">{initials}</div>
          </div>
        </header>
        <div className="adm-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
