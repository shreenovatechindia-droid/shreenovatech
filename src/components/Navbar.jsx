import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiMenu, FiX, FiSend } from 'react-icons/fi';
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';
import '../css/navbar.css';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Hosting', path: '/hosting', children: [
    { label: 'Shared Hosting',    path: '/shared-hosting' },
    { label: 'Cloud Hosting',     path: '/cloud-hosting' },
    { label: 'VPS Hosting',       path: '/vps-hosting' },
    { label: 'WordPress Hosting', path: '/wordpress-hosting' },
  ]},
  { label: 'Website Development', path: '/website-development', children: [
    { label: 'Business Website',  path: '/business-website' },
    { label: 'E-Commerce',        path: '/ecommerce-website' },
    { label: 'Landing Page',      path: '/landing-page' },
    { label: 'Custom Development',path: '/custom-development' },
  ]},
  { label: 'Digital Marketing', path: '/digital-marketing', children: [
    { label: 'Social Media',      path: '/social-media' },
    { label: 'Google Ads',        path: '/google-ads' },
    { label: 'Content Marketing', path: '/content-marketing' },
    { label: 'Email Marketing',   path: '/email-marketing' },
  ]},
  { label: 'SEO Services',  path: '/seo-services' },
  { label: 'Portfolio',     path: '/#portfolio',  hash: 'portfolio' },
  { label: 'Pricing',       path: '/#pricing',    hash: 'pricing' },
  { label: 'Contact',       path: '/#contact',    hash: 'contact' },
];

function HashLink({ item, className, style, onClick, children }) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick();
    const el = document.getElementById(item.hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(item.hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };
  return <a href={item.path} className={className} style={style} onClick={handleClick}>{children}</a>;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) =>
    setOpenDropdown(prev => prev === label ? null : label);

  return (
    <>
      <div className="topbar">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span>🎁 Special Offer! Get Professional Website at Just ₹9,999 INR – Limited Time Only!</span>
            <div className="d-flex align-items-center gap-3">
              <a href="tel:+918987050207"><FaPhone size={12} /> +91 89870 50207</a>
              <a href="mailto:support@shreenovatech.in"><FaEnvelope size={12} /> support@shreenovatech.in</a>
              <a href="https://wa.me/918987050207"><FaWhatsapp size={13} /> WhatsApp Us</a>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar-main">
        <div className="container">
          <div className="navbar-inner">
            <Link to="/" className="logo">
              <div className="logo-container">
                <img src="/logo.png" alt="ShreeNova Tech" className="logo-img" />
              </div>
            </Link>

            <ul className="nav-links">
              {navItems.map((item) =>
                item.children ? (
                  <li key={item.label} className="nav-dropdown">
                    <Link to={item.path} style={{cursor:'pointer'}}>
                      {item.label} <FiChevronDown size={13} />
                    </Link>
                    <div className="dropdown-menu-custom">
                      {item.children.map(c => <Link key={c.label} to={c.path}>{c.label}</Link>)}
                    </div>
                  </li>
                ) : item.hash ? (
                  <li key={item.label}>
                    <HashLink item={item}>{item.label}</HashLink>
                  </li>
                ) : (
                  <li key={item.label}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                )
              )}
            </ul>

            <div className="navbar-cta">
              <Link to="/about" className="btn-orange navbar-get-started">
                <FiSend size={14} /> About Us
              </Link>
            </div>

            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <div key={item.label} className="mob-nav-group">
              {item.children ? (
                <button
                  className="mob-nav-parent"
                  onClick={() => toggleDropdown(item.label)}
                >
                  <span>{item.label}</span>
                  <FiChevronDown
                    size={16}
                    className={`mob-chevron ${openDropdown === item.label ? 'open' : ''}`}
                  />
                </button>
              ) : item.hash ? (
                <HashLink item={item} className="mob-nav-parent" onClick={() => setMenuOpen(false)}>
                  <span>{item.label}</span>
                </HashLink>
              ) : (
                <Link to={item.path} className="mob-nav-parent" onClick={() => setMenuOpen(false)}>
                  <span>{item.label}</span>
                </Link>
              )}
              {item.children && openDropdown === item.label && (
                <div className="mob-nav-children">
                  {item.children.map(c => (
                    <Link key={c.label} to={c.path} className="mob-nav-child" onClick={() => { setMenuOpen(false); setOpenDropdown(null); }}>
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="mob-nav-footer">
            <Link to="/about" className="btn-orange mob-about-btn" onClick={() => setMenuOpen(false)}>
              <FiSend size={14} /> About Us
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
