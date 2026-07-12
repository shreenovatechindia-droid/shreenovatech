import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getNotifications, markNotifRead, markAllRead } from '../utils/api';
import {
  FiGrid, FiCalendar, FiCreditCard, FiMessageSquare,
  FiImage, FiDollarSign, FiStar, FiHelpCircle, FiServer,
  FiFileText, FiFolder, FiSearch, FiUsers, FiSettings,
  FiBell, FiLogOut, FiSun, FiMoon, FiMenu, FiX, FiExternalLink,
} from 'react-icons/fi';

const NAV = [
  { section: 'Main' },
  { to: '/dashboard', icon: FiGrid,         label: 'Dashboard' },
  { section: 'Management' },
  { to: '/bookings',  icon: FiCalendar,     label: 'Bookings',  key: 'bookings' },
  { to: '/payments',  icon: FiCreditCard,   label: 'Payments',  key: 'payments' },
  { to: '/contacts',  icon: FiMessageSquare,label: 'Contacts',  key: 'contacts' },
  { section: 'Website' },
  { to: '/portfolio',    icon: FiImage,     label: 'Portfolio' },
  { to: '/pricing',      icon: FiDollarSign,label: 'Pricing' },
  { to: '/testimonials', icon: FiStar,      label: 'Testimonials' },
  { to: '/faqs',         icon: FiHelpCircle,label: 'FAQs' },
  { to: '/hosting',      icon: FiServer,    label: 'Hosting Plans' },
  { to: '/blog',         icon: FiFileText,  label: 'Blog' },
  { section: 'System' },
  { to: '/media',    icon: FiFolder,  label: 'Media' },
  { to: '/seo',      icon: FiSearch,  label: 'SEO Settings' },
  { to: '/users',    icon: FiUsers,   label: 'Users' },
  { to: '/settings', icon: FiSettings,label: 'Settings' },
];

function fmtTime(dt) {
  if (!dt) return '';
  const d = new Date(dt);
  const diff = (Date.now() - d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return d.toLocaleDateString('en-IN');
}

export default function AdminLayout({ children, title }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark]             = useState(() => localStorage.getItem('snt_dark') === '1');
  const [notifs, setNotifs]         = useState([]);
  const [unread, setUnread]         = useState(0);
  const [notifOpen, setNotifOpen]   = useState(false);
  const notifRef = useRef();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('snt_dark', dark ? '1' : '0');
  }, [dark]);

  const loadNotifs = async () => {
    try {
      const r = await getNotifications();
      setNotifs(r.data.data.notifications || []);
      setUnread(r.data.data.unread || 0);
    } catch {}
  };

  useEffect(() => {
    loadNotifs();
    const t = setInterval(loadNotifs, 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = e => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNotifClick = async (n) => {
    if (!n.is_read) {
      await markNotifRead(n.id);
      loadNotifs();
    }
  };

  const handleMarkAll = async () => {
    await markAllRead();
    loadNotifs();
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const initials = user?.full_name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'A';

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:99 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <img src="/logo.png" alt="SNT" onError={e => e.target.style.display='none'} />
          {!collapsed && <span className="sidebar-logo-text">Shree<span>Nova</span> Tech</span>}
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item, i) => {
            if (item.section) return (
              <div className="nav-section" key={i}>{!collapsed && item.section}</div>
            );
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} className="nav-icon" />
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {!collapsed && (
            <div className="sidebar-user">
              <div className="sidebar-avatar">{initials}</div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user?.full_name || 'Admin'}</span>
                <span className="sidebar-user-role">{user?.role || 'admin'}</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <button className="toggle-btn" onClick={() => { setCollapsed(c => !c); setMobileOpen(o => !o); }}>
              {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
            <span className="page-title">{title}</span>
          </div>
          <div className="topbar-right">
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
              <FiExternalLink size={13} /> View Site
            </a>

            {/* Dark Mode */}
            <button className="dark-toggle" onClick={() => setDark(d => !d)} title="Toggle dark mode">
              {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button className="topbar-btn" onClick={() => setNotifOpen(o => !o)}>
                <FiBell size={18} />
                {unread > 0 && <span className="notif-badge">{unread > 99 ? '99+' : unread}</span>}
              </button>
              {notifOpen && (
                <div className="notif-panel">
                  <div className="notif-header">
                    <span className="notif-title">🔔 Notifications</span>
                    <button className="btn btn-sm btn-outline" onClick={handleMarkAll}>Mark all read</button>
                  </div>
                  <div className="notif-list">
                    {notifs.length === 0 ? (
                      <div className="empty-state" style={{ padding: '24px' }}>
                        <p>No notifications yet</p>
                      </div>
                    ) : notifs.map(n => (
                      <div
                        key={n.id}
                        className={`notif-item ${!n.is_read ? 'unread' : ''}`}
                        onClick={() => handleNotifClick(n)}
                      >
                        <div className={`notif-dot ${n.is_read ? 'read' : 'unread'}`} />
                        <div className="notif-content">
                          <div className="notif-item-title">{n.title}</div>
                          <div className="notif-item-msg">{n.message}</div>
                          <div className="notif-item-time">{fmtTime(n.created_at)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button className="topbar-btn" onClick={handleLogout} title="Logout">
              <FiLogOut size={18} />
            </button>

            <div className="topbar-user">
              <div className="topbar-avatar">{initials}</div>
              <span className="topbar-name">{user?.full_name?.split(' ')[0] || 'Admin'}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
