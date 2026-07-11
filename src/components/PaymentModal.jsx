import { useState, useEffect, useRef } from 'react';
import { FiX, FiUpload, FiSend, FiDownload, FiMessageCircle, FiArrowLeft, FiCopy } from 'react-icons/fi';
import './PaymentModal.css';

const PAYMENT_METHODS = [
  { id: 'upi',         label: 'UPI',          icon: '📱' },
  { id: 'qr',          label: 'QR Code',       icon: '🔲' },
  { id: 'gpay',        label: 'Google Pay',    icon: '🟢' },
  { id: 'phonepe',     label: 'PhonePe',       icon: '🟣' },
  { id: 'paytm',       label: 'Paytm',         icon: '🔵' },
  { id: 'bhim',        label: 'BHIM UPI',      icon: '🇮🇳' },
  { id: 'debit',       label: 'Debit Card',    icon: '💳' },
  { id: 'credit',      label: 'Credit Card',   icon: '💳' },
  { id: 'netbanking',  label: 'Net Banking',   icon: '🏦' },
  { id: 'bank',        label: 'Bank Transfer', icon: '🏛️' },
  { id: 'cash',        label: 'Cash',          icon: '💵' },
];

const BANK = {
  holder:  'ShreeNova Tech',
  bank:    'State Bank of India',
  account: 'XXXX XXXX XXXX',
  ifsc:    'SBIN0XXXXXX',
  branch:  'Main Branch',
  upi:     'shreenovatech@upi',
};

const STEPS = [
  'Choose Package',
  'Complete Payment',
  'Verify Payment',
  'Project Discussion',
  'Development Starts',
];

const empty = {
  fullName: '', mobile: '', whatsapp: '', email: '',
  company: '', gst: '', address: '', city: '', state: '', country: '', pincode: '',
  payMethod: '',
  screenshot: null,
  agreed: false,
};

function validate(f) {
  const e = {};
  if (!f.fullName.trim()) e.fullName = 'Full name is required.';
  if (!f.mobile.trim())   e.mobile   = 'Mobile number is required.';
  else if (!/^[6-9]\d{9}$/.test(f.mobile.trim())) e.mobile = 'Enter a valid 10-digit Indian mobile number.';
  if (!f.email.trim())    e.email    = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email address.';
  if (!f.payMethod)       e.payMethod = 'Please select a payment method.';
  if (!f.agreed)          e.agreed   = 'Please accept the terms to continue.';
  return e;
}

export default function PaymentModal({ plan, onClose }) {
  const [form, setForm]       = useState(empty);
  const [errors, setErrors]   = useState({});
  const [success, setSuccess] = useState(false);
  const fileRef               = useRef();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  const copy = text => navigator.clipboard?.writeText(text);

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSuccess(true);
  };

  const priceNum = parseInt(plan.price.replace(/[^\d]/g, ''), 10);
  const gst      = Math.round(priceNum * 0.18);

  return (
    <div className="pay-backdrop" onClick={onClose}>
      <div className="pay-modal" onClick={e => e.stopPropagation()}>
        <button className="pay-close" onClick={onClose}><FiX size={20} /></button>

        {success ? (
          <div className="pay-success">
            <div className="pay-success-icon">✓</div>
            <h3>Thank You!</h3>
            <p>
              Your payment request has been submitted successfully.<br />
              Our team will verify your payment within 30 minutes.<br />
              You will receive confirmation via WhatsApp and Email.
            </p>
            <button className="pay-success-close" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="pay-header">
              <h2 className="pay-title">Complete Your <span>Website Order</span></h2>
              <p className="pay-subtitle">Please review your selected package before making payment.</p>
            </div>

            {/* Steps */}
            <div className="pay-steps">
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <div className={`pay-step ${i === 1 ? 'active' : i < 1 ? 'done' : ''}`}>
                    <div className="pay-step-circle">{i < 1 ? '✓' : i + 1}</div>
                    <span className="pay-step-label">{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`pay-step-line${i < 1 ? ' done' : ''}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="pay-body">

              {/* ── LEFT ── */}
              <form className="pay-left" onSubmit={handleSubmit} noValidate>

                {/* Customer Details */}
                <div className="pay-section-title">Customer Details</div>
                <div className="pay-grid">
                  {[
                    { k: 'fullName', label: 'Full Name',        req: true,  ph: 'Your full name' },
                    { k: 'mobile',   label: 'Mobile Number',    req: true,  ph: '10-digit mobile number' },
                    { k: 'whatsapp', label: 'WhatsApp Number',  req: false, ph: 'WhatsApp number' },
                    { k: 'email',    label: 'Email Address',    req: true,  ph: 'your@email.com' },
                    { k: 'company',  label: 'Company Name',     req: false, ph: 'Company name' },
                    { k: 'gst',      label: 'GST Number (Optional)', req: false, ph: 'GST number' },
                    { k: 'address',  label: 'Address',          req: false, ph: 'Full address', full: true },
                    { k: 'city',     label: 'City',             req: false, ph: 'City' },
                    { k: 'state',    label: 'State',            req: false, ph: 'State' },
                    { k: 'country',  label: 'Country',          req: false, ph: 'Country' },
                    { k: 'pincode',  label: 'Pincode',          req: false, ph: 'Pincode' },
                  ].map(({ k, label, req, ph, full }) => (
                    <div className={`pay-field${full ? ' pay-grid-full' : ''}`} key={k}>
                      <label className="pay-label">{label}{req && <span className="pay-req">*</span>}</label>
                      <input
                        className={`pay-input${errors[k] ? ' pay-err' : ''}`}
                        type={k === 'email' ? 'email' : 'text'}
                        placeholder={ph}
                        value={form[k]}
                        onChange={e => set(k, e.target.value)}
                      />
                      {errors[k] && <span className="pay-err-msg">{errors[k]}</span>}
                    </div>
                  ))}
                </div>

                {/* Payment Method */}
                <div className="pay-section-title">Payment Method</div>
                <div className="pay-methods-grid">
                  {PAYMENT_METHODS.map(m => (
                    <div
                      key={m.id}
                      className={`pay-method-item${form.payMethod === m.id ? ' pay-method-active' : ''}`}
                      onClick={() => set('payMethod', m.id)}
                    >
                      <span className="pay-method-icon">{m.icon}</span>
                      {m.label}
                    </div>
                  ))}
                </div>
                {errors.payMethod && <span className="pay-err-msg">{errors.payMethod}</span>}

                {/* Bank Details */}
                <div className="pay-section-title">Bank Details</div>
                <div className="pay-bank-card">
                  {[
                    ['Account Holder', BANK.holder],
                    ['Bank Name',      BANK.bank],
                    ['Account Number', BANK.account],
                    ['IFSC Code',      BANK.ifsc],
                    ['Branch Name',    BANK.branch],
                    ['UPI ID',         BANK.upi],
                  ].map(([label, val]) => (
                    <div className="pay-bank-row" key={label}>
                      <span>{label}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {val}
                        <button type="button" className="pay-copy-btn" onClick={() => copy(val)}>
                          <FiCopy size={10} /> Copy
                        </button>
                      </span>
                    </div>
                  ))}
                </div>

                {/* QR Code */}
                <div className="pay-qr-box" style={{ marginTop: 12 }}>
                  <div className="pay-qr-placeholder">QR Code</div>
                  <span className="pay-qr-label">Scan to pay via any UPI app</span>
                </div>

                {/* Upload Screenshot */}
                <div className="pay-section-title">Upload Payment Screenshot</div>
                <div className="pay-upload-box" onClick={() => fileRef.current.click()}>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={e => {
                      const f = e.target.files[0];
                      if (f && f.size > 10 * 1024 * 1024) { alert('Max file size is 10MB.'); return; }
                      set('screenshot', f || null);
                    }}
                  />
                  <span className="pay-upload-icon"><FiUpload size={24} /></span>
                  <span className="pay-upload-text">Click to upload payment screenshot</span>
                  <span className="pay-upload-hint">JPG, JPEG, PNG, PDF — Max 10MB</span>
                  {form.screenshot && <span className="pay-upload-name">{form.screenshot.name}</span>}
                </div>

                {/* Terms */}
                <label className="pay-terms">
                  <input
                    type="checkbox"
                    checked={form.agreed}
                    onChange={e => set('agreed', e.target.checked)}
                  />
                  I have completed the payment and agree to the{' '}
                  <a href="#" onClick={e => e.preventDefault()}>Terms &amp; Conditions</a>.
                </label>
                {errors.agreed && <span className="pay-err-msg" style={{ marginTop: 4 }}>{errors.agreed}</span>}

                {/* Buttons */}
                <div className="pay-btns">
                  <button type="submit" className="pay-btn-primary">
                    <FiSend size={15} /> Submit Payment
                  </button>
                  <button type="button" className="pay-btn-orange" onClick={() => window.print()}>
                    <FiDownload size={15} /> Download Invoice
                  </button>
                  <a href="#contact" className="pay-btn-outline" onClick={onClose}>
                    <FiMessageCircle size={15} /> Contact Support
                  </a>
                  <button type="button" className="pay-btn-outline" onClick={onClose}>
                    <FiArrowLeft size={15} /> Back
                  </button>
                </div>

              </form>

              {/* ── RIGHT ── */}
              <div className="pay-right">

                {/* Package Card */}
                <div className="pay-pkg-card">
                  <div className="pay-pkg-header">
                    <span className="pay-pkg-name">{plan.name}</span>
                    <span className="pay-pkg-price">{plan.price}</span>
                  </div>
                  <div className="pay-pkg-body">
                    <div className="pay-pkg-renewal">{plan.renewal}</div>
                    <ul className="pay-pkg-features">
                      {plan.features.map(f => (
                        <li key={f}>
                          <span className="pay-pkg-tick">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <div className="pay-section-title" style={{ marginTop: 0 }}>Payment Status</div>
                  <span className="pay-status-badge">⏳ Pending Verification</span>
                </div>

                {/* Summary */}
                <div className="pay-summary-card">
                  <div className="pay-summary-title">Payment Summary</div>
                  <div className="pay-summary-row">
                    <span>{plan.name}</span>
                    <span>{plan.price}</span>
                  </div>
                  <div className="pay-summary-row">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pay-summary-row">
                    <span>Discount</span>
                    <span style={{ color: '#16A34A' }}>— ₹0</span>
                  </div>
                  <div className="pay-summary-row pay-total">
                    <span>Total Amount</span>
                    <span>₹{(priceNum + gst).toLocaleString('en-IN')}</span>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
