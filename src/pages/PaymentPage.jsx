import { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiSend, FiDownload, FiMessageCircle,
  FiUser, FiPhone, FiMail, FiBriefcase, FiUpload,
} from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import { submitPayment } from '../utils/api';
import './PaymentPage.css';

/* ── Package data ── */
const PACKAGES = {
  basic: {
    key: 'basic', badge: 'BASIC', name: 'Basic Website Package',
    price: '₹14,999', priceNum: 14999,
    renewal: 'Renewal After 1 Year Only ₹4999',
    delivery: '3–5 Working Days',
    features: [
      'Static Website','Responsive Design','Up to 5 Pages',
      '1 Year Free Domain','2 Business Emails','SSL Security',
      'Mobile Friendly Design','Call / WhatsApp Button','Basic SEO Setup',
      'Basic Speed Optimization','Contact Form','Google Map',
      'Social Media Integration','Payment Gateway Integration','Delivery Time 3–5 Days',
    ],
  },
  dynamic: {
    key: 'dynamic', badge: 'DYNAMIC', name: 'Dynamic Website Package',
    price: '₹29,999', priceNum: 29999,
    renewal: 'Renewal After 1 Year Only ₹4999',
    delivery: '5–7 Working Days',
    features: [
      'Dynamic Website','Responsive Design','Up to 10 Pages',
      '1 Year Free Domain','5 Business Emails','Backend Development',
      'Database Integration','User Login','Contact Management',
      'CMS Features','Payment Gateway Integration','Advanced SEO Setup',
      'Advanced Speed Optimization','Premium UI / UX','Delivery Time 5–7 Days',
    ],
  },
  diamond: {
    key: 'diamond', badge: 'DIAMOND', name: 'Diamond Package',
    price: '₹49,999', priceNum: 49999,
    renewal: 'Renewal After 1 Year Only ₹4999',
    delivery: '7–10 Working Days',
    features: [
      'Dynamic Website','Premium UI / UX Design','Unlimited Pages',
      '1 Year Free Domain','Unlimited Business Emails','Backend Development',
      'Admin Dashboard','Database Integration','User Management',
      'Booking Management','Payment Management','Analytics Dashboard',
      'Blog Management','Gallery Management','SEO Management',
      'API Integration','WhatsApp Integration','Email Integration',
      'Security Features','Premium SEO Setup','Premium Speed Optimization',
      'Lifetime Code Quality','Delivery Time 7–10 Days',
    ],
  },
};

const SERVICES = [
  { id: 'business-website',   icon: '🌐', label: 'Business Website' },
  { id: 'ecommerce-website',  icon: '🛒', label: 'E-Commerce Website' },
  { id: 'corporate-website',  icon: '🏢', label: 'Corporate Website' },
  { id: 'android-app',        icon: '📱', label: 'Android App' },
  { id: 'ios-app',            icon: '🍎', label: 'iOS App' },
  { id: 'react-native-app',   icon: '📲', label: 'React Native App' },
  { id: 'custom-software',    icon: '💻', label: 'Custom Software' },
  { id: 'crm-development',    icon: '📊', label: 'CRM Development' },
  { id: 'erp-development',    icon: '🏭', label: 'ERP Development' },
  { id: 'web-hosting',        icon: '☁️', label: 'Web Hosting' },
  { id: 'domain-registration',icon: '🌍', label: 'Domain Registration' },
  { id: 'seo-services',       icon: '🔍', label: 'SEO Services' },
  { id: 'digital-marketing',  icon: '📣', label: 'Digital Marketing' },
  { id: 'ui-ux-design',       icon: '🎨', label: 'UI/UX Design' },
  { id: 'maintenance',        icon: '⚙️', label: 'Website Maintenance' },
  { id: 'api-integration',    icon: '🔗', label: 'API Integration' },
  { id: 'other',              icon: '✏️', label: 'Other' },
];

const UPI_APPS = [
  { id: 'gpay',    label: 'Google Pay',  icon: '🟢' },
  { id: 'phonepe', label: 'PhonePe',     icon: '🟣' },
  { id: 'paytm',   label: 'Paytm',       icon: '🔵' },
  { id: 'bhim',    label: 'BHIM UPI',    icon: '🇮🇳' },
  { id: 'upi',     label: 'UPI',         icon: '📱' },
];

const STEPS = [
  { label: 'Package',  icon: '📦' },
  { label: 'Payment',  icon: '💳' },
  { label: 'Confirm',  icon: '☑️' },
];

const empty = {
  fullName: '', mobile: '', email: '', company: '',
  payMethod: 'upi', screenshot: null, agreed: false,
  serviceType: '', otherDesc: '',
  /* kept for backend compat */
  whatsapp: '', gst: '', address: '', city: '', state: '', country: 'India', pincode: '',
};

function validate(f) {
  const e = {};
  if (!f.fullName.trim()) e.fullName = 'Full name is required.';
  if (!f.mobile.trim())   e.mobile   = 'Mobile number is required.';
  else if (!/^[6-9]\d{9}$/.test(f.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number.';
  if (!f.email.trim())    e.email    = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email address.';
  if (!f.agreed)          e.agreed   = 'Please accept the terms to continue.';
  return e;
}

const refId = () => 'SNT-' + Date.now().toString(36).toUpperCase();

function Field({ label, req, error, icon, children }) {
  return (
    <div className="pp-field">
      <label className="pp-label">{label}{req && <span className="pp-req">*</span>}</label>
      <div className="pp-input-wrap">
        {icon && <span className="pp-input-icon">{icon}</span>}
        {children}
      </div>
      {error && <span className="pp-err-msg">{error}</span>}
    </div>
  );
}

export default function PaymentPage() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const pkgKey          = searchParams.get('package') || 'basic';
  const plan            = PACKAGES[pkgKey] || PACKAGES.basic;

  const [form, setForm]         = useState(empty);
  const [errors, setErrors]     = useState({});
  const [success, setSuccess]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverRef, setServerRef]   = useState('');
  const [ref]                       = useState(refId);
  const fileRef                     = useRef();

  const gst   = Math.round(plan.priceNum * 0.18);
  const total = plan.priceNum + gst;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('fullName',  form.fullName);
      fd.append('mobile',    form.mobile);
      fd.append('whatsapp',  form.mobile);
      fd.append('email',     form.email);
      fd.append('company',   form.company);
      fd.append('gst',       '');
      fd.append('address',   '');
      fd.append('city',      '');
      fd.append('state',     '');
      fd.append('country',   'India');
      fd.append('pincode',   '');
      fd.append('payMethod',   form.payMethod);
      fd.append('package',     pkgKey);
      fd.append('serviceType', form.serviceType === 'other' ? (form.otherDesc || 'Other') : form.serviceType);
      if (form.screenshot) fd.append('screenshot', form.screenshot);
      const res = await submitPayment(fd);
      setServerRef(res.data?.data?.ref_id || ref);
      setSuccess(true);
    } catch {
      setServerRef(ref);
      setSuccess(true);
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* ── Progress Bar ── */
  const currentStep = success ? 2 : 1;
  const ProgressBar = (
    <div className="pp-progress-wrap">
      {STEPS.map((s, i) => (
        <div key={s.label} className="pp-progress-item">
          <div className={`pp-progress-step ${i < currentStep ? 'pp-prog-done' : i === currentStep ? 'pp-prog-active' : ''}`}>
            {i < currentStep ? '✓' : s.icon}
          </div>
          <span className={`pp-progress-label ${i === currentStep ? 'pp-prog-label-active' : ''}`}>{s.label}</span>
          {i < STEPS.length - 1 && (
            <div className={`pp-progress-line ${i < currentStep ? 'pp-prog-line-done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );

  /* ── Sidebar ── */
  const Sidebar = (
    <div className="pp-sidebar">
      <div className="pp-pkg-card">
        <div className="pp-pkg-header">
          <div className="pp-pkg-badge">✦ {plan.badge}</div>
          <div className="pp-pkg-name">{plan.name}</div>
          <div className="pp-pkg-price">{plan.price}</div>
        </div>
        <div className="pp-pkg-body">
          <div className="pp-pkg-renewal">{plan.renewal}</div>
          <ul className="pp-pkg-features">
            {plan.features.map(f => (
              <li key={f}><span className="pp-pkg-tick">✓</span>{f}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pp-summary-card">
        <div className="pp-summary-title">Order Summary</div>
        {form.serviceType && (
          <div className="pp-summary-row">
            <span>Selected Service</span>
            <span>{SERVICES.find(s => s.id === form.serviceType)?.label || form.serviceType}</span>
          </div>
        )}
        <div className="pp-summary-row">
          <span>Selected Package</span><span>{plan.name}</span>
        </div>
        <div className="pp-summary-row">
          <span>Package Price</span><span>{plan.price}</span>
        </div>
        <div className="pp-summary-row">
          <span>GST (18%)</span><span>₹{gst.toLocaleString('en-IN')}</span>
        </div>
        <div className="pp-summary-row">
          <span>🚀 Delivery</span><span>{plan.delivery}</span>
        </div>
        <div className="pp-summary-row">
          <span>🎁 Support</span><span>1 Year Free</span>
        </div>
        <div className="pp-summary-total">
          <span>Total Amount</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="pp-status-badge">⏳ Pending Verification</div>
    </div>
  );

  return (
    <MainLayout>
      <div className="pp-page">
        <div className="container">

          {/* Header */}
          <div className="pp-header">
            <div className="pp-breadcrumb">
              <Link to="/">Home</Link><span>/</span>
              <Link to="/#pricing">Pricing</Link><span>/</span>
              <span>Payment</span>
            </div>
            <h1 className="pp-title">Complete Your <span>Website Order</span></h1>
            <p className="pp-subtitle">Scan the QR code, fill your details and submit your payment screenshot.</p>
          </div>

          {/* Progress */}
          {ProgressBar}

          {/* Success */}
          {success ? (
            <div className="pp-success">
              <div className="pp-success-icon">✓</div>
              <h2>Payment Submitted!</h2>
              <p className="pp-success-sub">Thank you, {form.fullName || 'there'}!</p>
              <div className="pp-ref-badge">Reference ID: {serverRef || ref}</div>
              <p>
                Your payment has been submitted successfully.<br />
                Our team will verify within 30 minutes.<br />
                Confirmation will be sent via WhatsApp & Email.
              </p>
              <div className="pp-contact-badge">⏱ Estimated Contact: Within 30 Minutes</div>
              <div className="pp-success-btns">
                <Link to="/" className="pp-success-btn-green"><FiArrowLeft size={15}/> Go Home</Link>
                <a className="pp-success-btn-wa" href="https://wa.me/918987050207" target="_blank" rel="noreferrer">💬 WhatsApp Support</a>
                <button className="pp-success-btn-outline" onClick={() => window.print()}><FiDownload size={14}/> Download PDF</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="pp-body">

                {/* ── LEFT ── */}
                <div className="pp-left">

                  {/* Select Service */}
                  <div className="pp-card">
                    <div className="pp-card-title">Select Your Service</div>
                    <p className="pp-service-sub">Choose the service you are making payment for.</p>
                    <div className="pp-service-grid">
                      {SERVICES.map(s => (
                        <div
                          key={s.id}
                          className={`pp-service-card${form.serviceType === s.id ? ' pp-service-active' : ''}`}
                          onClick={() => set('serviceType', s.id)}
                        >
                          {form.serviceType === s.id && <span className="pp-service-check">✓</span>}
                          <span className="pp-service-icon">{s.icon}</span>
                          <span className="pp-service-label">{s.label}</span>
                        </div>
                      ))}
                    </div>
                    {form.serviceType === 'other' && (
                      <textarea
                        className="pp-other-input"
                        placeholder="Please describe your requirement..."
                        value={form.otherDesc}
                        onChange={e => set('otherDesc', e.target.value)}
                      />
                    )}
                  </div>

                  {/* QR Payment Card */}
                  <div className="pp-card">
                    <div className="pp-card-title">Scan & Pay</div>
                    <div className="pp-qr-section">
                      <div className="pp-qr-wrap">
                        <img src="/sc.jpg" alt="UPI QR Code" className="pp-qr-img" />
                        <div className="pp-qr-label">Scan the QR Code using any UPI app</div>
                      </div>
                      <div className="pp-upi-apps">
                        <div className="pp-upi-title">Accepted Payment Apps</div>
                        <div className="pp-upi-grid">
                          {UPI_APPS.map(a => (
                            <div key={a.id} className="pp-upi-app">
                              <span className="pp-upi-icon">{a.icon}</span>
                              <span>{a.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Screenshot */}
                  <div className="pp-card">
                    <div className="pp-card-title">Upload Payment Screenshot</div>
                    <div className="pp-upload-box" onClick={() => fileRef.current.click()}>
                      <input
                        ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf"
                        onChange={e => {
                          const f = e.target.files[0];
                          if (f && f.size > 10*1024*1024) { alert('Max file size is 10MB.'); return; }
                          set('screenshot', f || null);
                        }}
                      />
                      <div className="pp-upload-icon-wrap">
                        <FiUpload size={32} />
                      </div>
                      {form.screenshot ? (
                        <span className="pp-upload-name">✓ {form.screenshot.name}</span>
                      ) : (
                        <>
                          <span className="pp-upload-text">Click or drag & drop your screenshot here</span>
                          <span className="pp-upload-hint">JPG, JPEG, PNG, PDF — Max 10MB</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="pp-card">
                    <div className="pp-card-title">Customer Details</div>
                    <div className="pp-grid">
                      <Field label="Full Name" req icon={<FiUser size={15}/>} error={errors.fullName}>
                        <input className={`pp-input${errors.fullName?' pp-err':''}`} placeholder="Your full name" value={form.fullName} onChange={e=>set('fullName',e.target.value)} />
                      </Field>
                      <Field label="Mobile Number" req icon={<FiPhone size={15}/>} error={errors.mobile}>
                        <input className={`pp-input${errors.mobile?' pp-err':''}`} placeholder="10-digit mobile number" value={form.mobile} onChange={e=>set('mobile',e.target.value)} />
                      </Field>
                      <Field label="Email Address" req icon={<FiMail size={15}/>} error={errors.email}>
                        <input className={`pp-input${errors.email?' pp-err':''}`} type="email" placeholder="your@email.com" value={form.email} onChange={e=>set('email',e.target.value)} />
                      </Field>
                      <Field label="Company Name (Optional)" icon={<FiBriefcase size={15}/>}>
                        <input className="pp-input" placeholder="Your company name" value={form.company} onChange={e=>set('company',e.target.value)} />
                      </Field>
                    </div>
                  </div>

                  {/* Terms & Buttons */}
                  <div className="pp-card">
                    <div className="pp-card-title">Terms & Conditions</div>
                    <label className="pp-terms">
                      <input type="checkbox" checked={form.agreed} onChange={e=>set('agreed',e.target.checked)} />
                      <span>I have completed the payment and agree to the{' '}
                        <a href="#" onClick={e=>e.preventDefault()}>Terms &amp; Conditions</a> and{' '}
                        <a href="#" onClick={e=>e.preventDefault()}>Privacy Policy</a>.
                      </span>
                    </label>
                    {errors.agreed && <span className="pp-err-msg" style={{marginTop:8,display:'block'}}>{errors.agreed}</span>}

                    <div className="pp-btns">
                      <button type="submit" className="pp-btn-submit" disabled={submitting}>
                        <FiSend size={15}/> {submitting ? 'Submitting...' : 'Submit Payment'}
                      </button>
                      <button type="button" className="pp-btn-orange" onClick={() => window.print()}>
                        <FiDownload size={15}/> Download Invoice
                      </button>
                      <a href="/#contact" className="pp-btn-outline">
                        <FiMessageCircle size={15}/> Contact Support
                      </a>
                      <button type="button" className="pp-btn-outline" onClick={() => navigate(-1)}>
                        <FiArrowLeft size={15}/> Back
                      </button>
                    </div>
                  </div>

                </div>

                {/* ── RIGHT SIDEBAR ── */}
                {Sidebar}

              </div>
            </form>
          )}

        </div>
      </div>
    </MainLayout>
  );
}
