import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiArrowRight, FiPhone, FiMessageCircle } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import '../css/service-pages.css';

/* ── FAQ ── */
export function FAQ({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="sp-faq">
      {items.map((f, i) => (
        <div className="sp-faq-item" key={i}>
          <button className="sp-faq-q" onClick={() => setOpen(open === i ? null : i)}>
            {f.q}
            {open === i ? <FiMinus size={16} /> : <FiPlus size={16} />}
          </button>
          {open === i && <div className="sp-faq-a">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

/* ── CTA Banner ── */
export function CTABanner({ title, subtitle }) {
  return (
    <section className="sp-section sp-section-light">
      <div className="container">
        <div className="sp-cta">
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <div className="sp-cta-btns">
            <Link to="/book-now" className="btn-green">
              Book Free Consultation <FiArrowRight size={15} />
            </Link>
            <a href="tel:+918987050207" className="btn-orange">
              <FiPhone size={15} /> Call Now
            </a>
            <a href="https://wa.me/918987050207" target="_blank" rel="noreferrer"
              style={{ background:'#25D366', color:'#fff', borderRadius:10, padding:'12px 24px', fontWeight:600, fontSize:15, display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none', transition:'transform 0.2s' }}>
              <FiMessageCircle size={15} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Hero ── */
export function ServiceHero({ badge, title, highlight, desc, breadcrumb, stats = [] }) {
  return (
    <div className="sp-hero">
      <div className="sp-hero-inner">
        <div className="sp-breadcrumb">
          <Link to="/">Home</Link>
          {breadcrumb.map((b, i) => (
            <span key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span>/</span>
              {b.path ? <Link to={b.path}>{b.label}</Link> : <span style={{ color:'rgba(255,255,255,0.9)' }}>{b.label}</span>}
            </span>
          ))}
        </div>
        {badge && <div className="sp-hero-badge">{badge}</div>}
        <h1>{title} <span>{highlight}</span></h1>
        <p>{desc}</p>
        <div className="sp-hero-btns">
          <Link to="/book-now" className="btn-green">Get Free Quote <FiArrowRight size={15} /></Link>
          <a href="tel:+918987050207" className="btn-orange"><FiPhone size={15} /> +91 89870 50207</a>
        </div>
        {stats.length > 0 && (
          <div className="sp-hero-stats">
            {stats.map(s => (
              <div className="sp-hero-stat" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Reviews ── */
export const REVIEWS = [
  { name:'Rahul Sharma', role:'Business Owner, Delhi', text:'ShreeNova Tech delivered our website in just 5 days. The design is modern, fast and exactly what we needed. Highly recommended!', init:'R' },
  { name:'Priya Patel', role:'E-Commerce Store, Mumbai', text:'Our online store sales increased by 40% after the new website. The team is professional and always available for support.', init:'P' },
  { name:'Amit Singh', role:'Hospital, Noida', text:'They built our hospital website with appointment booking and doctor profiles. Excellent work and great after-sales support.', init:'A' },
];

export function Reviews() {
  return (
    <section className="sp-section sp-section-white">
      <div className="container">
        <div className="sp-section-head">
          <h2>What Our <span>Clients Say</span></h2>
          <p>Real feedback from real clients across India who trust ShreeNova Tech.</p>
        </div>
        <div className="sp-reviews">
          {REVIEWS.map(r => (
            <div className="sp-review-card" key={r.name}>
              <div className="sp-review-stars">★★★★★</div>
              <p className="sp-review-text">"{r.text}"</p>
              <div className="sp-review-author">
                <div className="sp-review-avatar">{r.init}</div>
                <div>
                  <div className="sp-review-name">{r.name}</div>
                  <div className="sp-review-role">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServiceLayout({ children }) {
  return <MainLayout><div className="sp-page">{children}</div></MainLayout>;
}
