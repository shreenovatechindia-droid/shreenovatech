import { useEffect, useRef, useState } from 'react';
import { submitContact } from '../utils/api';
import './EnquiryPopup.css';

const SESSION_KEY = 'ep_shown_v2';

const validate = (form) => {
  const errs = {};
  if (!form.name.trim())                          errs.name   = 'Full name is required.';
  if (!form.email.trim())                         errs.email  = 'Email address is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.';
  if (!form.phone.trim())                         errs.phone  = 'Mobile number is required.';
  else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) errs.phone = 'Enter a valid 10-digit mobile number.';
  if (!form.address.trim())                       errs.address = 'Address is required.';
  return errs;
};

/* ── Inline SVG icons ── */
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
  </svg>
);

export default function EnquiryPopup() {
  const [visible, setVisible]   = useState(false);
  const [closing, setClosing]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', phone: '', address: '' });
  const [errors, setErrors]     = useState({});
  const firstInputRef           = useRef(null);

  useEffect(() => { setVisible(true); }, []);

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = 'hidden';
    firstInputRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [visible]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setVisible(false); setClosing(false); }, 320);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await submitContact({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: `Enquiry Popup — Address: ${form.address}`,
        subject: 'Website Enquiry Popup',
      });
    } catch (_) { /* silent — show success regardless */ }
    setLoading(false);
    setSuccess(true);
    setTimeout(() => handleClose(), 2800);
  };

  if (!visible) return null;

  return (
    <div className={`ep-overlay${closing ? ' ep-closing' : ''}`} onClick={handleClose}>
      <div
        className="ep-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Enquiry Popup"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button className="ep-close" onClick={handleClose} aria-label="Close">
          <IconClose />
        </button>

        {/* Header */}
        <div className="ep-header">
          <div className="ep-header-orb ep-header-orb--1" />
          <div className="ep-header-orb ep-header-orb--2" />
          <div className="ep-header-orb ep-header-orb--3" />
          <div className="ep-rocket" aria-hidden="true">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="40" cy="72" rx="14" ry="5" fill="rgba(255,255,255,0.12)"/>
              <path d="M40 8C40 8 22 22 22 44c0 8 4 14 8 18l10 6 10-6c4-4 8-10 8-18C58 22 40 8 40 8Z" fill="rgba(255,255,255,0.95)"/>
              <path d="M40 8C40 8 22 22 22 44c0 8 4 14 8 18l10-28V8Z" fill="rgba(255,255,255,0.7)"/>
              <circle cx="40" cy="36" r="7" fill="#16a34a"/>
              <circle cx="40" cy="36" r="4" fill="rgba(255,255,255,0.9)"/>
              <path d="M22 44c-4 2-8 8-8 14l8-4" fill="rgba(255,255,255,0.6)"/>
              <path d="M58 44c4 2 8 8 8 14l-8-4" fill="rgba(255,255,255,0.6)"/>
              <path d="M34 62c-2 4-2 8 0 10 2-2 4-6 6-10" fill="rgba(255,165,0,0.8)"/>
              <path d="M46 62c2 4 2 8 0 10-2-2-4-6-6-10" fill="rgba(255,140,0,0.7)"/>
              <path d="M38 66c0 4 1 7 2 8 1-1 2-4 2-8" fill="rgba(255,200,0,0.9)"/>
            </svg>
          </div>
          <h2>Get Your FREE Website Consultation</h2>
          <p>Grow your business with a professional website.</p>
          <div className="ep-badges">
            <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 100% Free</span>
            <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> Quick Response</span>
            <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> 100% Secure</span>
          </div>
          <div className="ep-header-wave">
            <svg viewBox="0 0 560 32" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0 Q140 32 280 16 Q420 0 560 24 L560 32 L0 32 Z" fill="rgba(255,255,255,0.92)"/>
            </svg>
          </div>
        </div>

        {/* Body */}
        <div className="ep-body">
          {success ? (
            <div className="ep-success">
              <div className="ep-success-ring">
                <svg className="ep-check-svg" viewBox="0 0 52 52">
                  <circle className="ep-check-circle" cx="26" cy="26" r="24" fill="none" stroke="#16a34a" strokeWidth="2.5"/>
                  <path className="ep-check-tick" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 27l8 8 16-16"/>
                </svg>
              </div>
              <h3>Thank You!</h3>
              <p>Our team will contact you shortly.</p>
              <div className="ep-success-dots">
                <span/><span/><span/>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>

              {/* Name */}
              <div className={`ep-field${errors.name ? ' ep-field--error' : ''}${form.name ? ' ep-field--filled' : ''}`}>
                <div className="ep-input-wrap">
                  <span className="ep-input-icon"><IconUser /></span>
                  <input
                    ref={firstInputRef}
                    type="text"
                    name="name"
                    id="ep-name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder=" "
                    autoComplete="name"
                  />
                  <label htmlFor="ep-name">Full Name <span className="ep-req">*</span></label>
                </div>
                {errors.name && <span className="ep-err-msg">{errors.name}</span>}
              </div>

              {/* Email */}
              <div className={`ep-field${errors.email ? ' ep-field--error' : ''}${form.email ? ' ep-field--filled' : ''}`}>
                <div className="ep-input-wrap">
                  <span className="ep-input-icon"><IconMail /></span>
                  <input
                    type="email"
                    name="email"
                    id="ep-email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder=" "
                    autoComplete="email"
                  />
                  <label htmlFor="ep-email">Email Address <span className="ep-req">*</span></label>
                </div>
                {errors.email && <span className="ep-err-msg">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className={`ep-field${errors.phone ? ' ep-field--error' : ''}${form.phone ? ' ep-field--filled' : ''}`}>
                <div className="ep-input-wrap">
                  <span className="ep-input-icon"><IconPhone /></span>
                  <input
                    type="tel"
                    name="phone"
                    id="ep-phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder=" "
                    maxLength={10}
                    autoComplete="tel"
                  />
                  <label htmlFor="ep-phone">Mobile Number <span className="ep-req">*</span></label>
                </div>
                {errors.phone && <span className="ep-err-msg">{errors.phone}</span>}
              </div>

              {/* Address */}
              <div className={`ep-field${errors.address ? ' ep-field--error' : ''}${form.address ? ' ep-field--filled' : ''}`}>
                <div className="ep-input-wrap">
                  <span className="ep-input-icon"><IconPin /></span>
                  <input
                    type="text"
                    name="address"
                    id="ep-address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder=" "
                    autoComplete="street-address"
                  />
                  <label htmlFor="ep-address">Address <span className="ep-req">*</span></label>
                </div>
                {errors.address && <span className="ep-err-msg">{errors.address}</span>}
              </div>

              <button type="submit" className="ep-submit" disabled={loading}>
                {loading ? (
                  <span className="ep-spinner-wrap">
                    <span className="ep-spinner" />
                    Submitting…
                  </span>
                ) : (
                  <span className="ep-btn-inner">
                    <IconSend /> Submit Enquiry
                  </span>
                )}
              </button>

              <p className="ep-footer-note">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Your information is safe with us. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
