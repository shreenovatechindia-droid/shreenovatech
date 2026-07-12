import { useState, useEffect, useRef } from 'react';
import {
  FiX, FiUpload, FiSend, FiArrowRight, FiArrowLeft,
  FiUser, FiPhone, FiMail, FiGlobe, FiBriefcase,
  FiMapPin, FiMessageSquare, FiDownload,
} from 'react-icons/fi';
import { submitBooking } from '../utils/api';
import './BookingModal.css';

/* ── Constants ── */
const PROJECT_TYPES = [
  'Business Website','E-Commerce Website','Portfolio Website',
  'School Website','Hospital Website','Restaurant Website',
  'Real Estate Website','Corporate Website','Landing Page','Custom Website',
];
const SERVICES = [
  'Website Development','Mobile App Development','UI/UX Design',
  'SEO','Google Ads','Meta Ads',
  'Domain Registration','Hosting','Website Maintenance',
  'CRM Development','ERP Development','API Integration',
];
const BUDGETS   = ['₹5,000 – ₹10,000','₹10,000 – ₹25,000','₹25,000 – ₹50,000','₹50,000+'];
const TIMELINES = ['Immediately','Within 7 Days','Within 15 Days','Within 1 Month','Flexible'];
const ACCEPT    = '.jpg,.jpeg,.png,.pdf,.docx';
const MAX_MB    = 10;

const STEPS = ['Customer Details','Project Details','Upload & Terms','Confirmation'];

const PANEL_FEATURES = [
  'Premium Website Development',
  'Mobile App Development',
  'SEO Services',
  'Digital Marketing',
  '24×7 Support',
  'Free Consultation',
  '1 Year Support',
  'Secure Payment',
];

const empty = {
  fullName:'', mobile:'', whatsapp:'', email:'',
  company:'', business:'', website:'', city:'', state:'', country:'',
  projectType:'', budget:'', timeline:'', description:'',
  services:[], consent:false,
  logoFile:null, imagesFile:null, docsFile:null,
};

/* ── Validation per step ── */
function validateStep(step, f) {
  const e = {};
  if (step === 0) {
    if (!f.fullName.trim()) e.fullName = 'Full name is required.';
    if (!f.mobile.trim())   e.mobile   = 'Mobile number is required.';
    else if (!/^[6-9]\d{9}$/.test(f.mobile.trim())) e.mobile = 'Enter a valid 10-digit Indian mobile number.';
    if (!f.email.trim())    e.email    = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email address.';
  }
  if (step === 1) {
    if (!f.projectType) e.projectType = 'Please select a project type.';
  }
  if (step === 2) {
    if (!f.consent) e.consent = 'Please accept the terms to continue.';
  }
  return e;
}

/* ── File upload box ── */
function FileBox({ label, hint, name, file, onChange }) {
  const ref = useRef();
  return (
    <div className="bm-upload-box" onClick={() => ref.current.click()}>
      <input ref={ref} type="file" accept={ACCEPT}
        onChange={e => {
          const f = e.target.files[0];
          if (f && f.size > MAX_MB * 1024 * 1024) { alert(`Max file size is ${MAX_MB}MB.`); return; }
          onChange(name, f || null);
        }}
      />
      <span className="bm-upload-icon"><FiUpload size={22} /></span>
      <span className="bm-upload-label">{label}</span>
      {file
        ? <span className="bm-upload-name">{file.name}</span>
        : <span className="bm-upload-hint">{hint}</span>
      }
    </div>
  );
}

/* ── Input with icon ── */
function Field({ label, req, error, icon, children }) {
  return (
    <div className="bm-field">
      <label className="bm-label">{label}{req && <span className="bm-req">*</span>}</label>
      <div className="bm-input-wrap">
        {icon && <span className="bm-input-icon">{icon}</span>}
        {children}
      </div>
      {error && <span className="bm-error-msg">{error}</span>}
    </div>
  );
}

/* ── Generate reference ID ── */
const refId = () => 'SNT-' + Date.now().toString(36).toUpperCase();

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function BookingModal({ onClose }) {
  const [form, setForm]     = useState(empty);
  const [errors, setErrors] = useState({});
  const [step, setStep]     = useState(0);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverRef, setServerRef]   = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  const toggleService = s =>
    set('services', form.services.includes(s)
      ? form.services.filter(x => x !== s)
      : [...form.services, s]);

  const next = () => {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const prev = () => { setErrors({}); setStep(s => s - 1); };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validateStep(2, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('fullName',    form.fullName);
      fd.append('mobile',      form.mobile);
      fd.append('whatsapp',    form.whatsapp || form.mobile);
      fd.append('email',       form.email);
      fd.append('company',     form.company);
      fd.append('business',    form.business || form.company);
      fd.append('website',     form.website);
      fd.append('city',        form.city);
      fd.append('state',       form.state);
      fd.append('country',     form.country || 'India');
      fd.append('projectType', form.projectType);
      fd.append('budget',      form.budget);
      fd.append('timeline',    form.timeline || 'Flexible');
      fd.append('description', form.description);
      fd.append('services',    JSON.stringify(form.services));
      if (form.logoFile)   fd.append('logoFile',   form.logoFile);
      if (form.imagesFile) fd.append('imagesFile', form.imagesFile);
      if (form.docsFile)   fd.append('docsFile',   form.docsFile);

      const res = await submitBooking(fd);
      setServerRef(res.data?.data?.ref_id || '');
      setSuccess(true);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Submission failed. Please try again.';
      setErrors(p => ({ ...p, submit: msg }));
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Left panel ── */
  const LeftPanel = (
    <div className="bm-left">
      <div className="bm-logo-wrap">
        <div className="bm-logo-circle">S</div>
        <div className="bm-logo-text">
          ShreeNova Tech
          <span>Premium Web Solutions</span>
        </div>
      </div>

      <div className="bm-panel-heading">
        Start Your Digital Journey
        <span>Fill the form and we'll contact you within 30 minutes.</span>
      </div>

      <ul className="bm-panel-features">
        {PANEL_FEATURES.map(f => (
          <li key={f}>
            <span className="bm-panel-tick">✓</span>
            {f}
          </li>
        ))}
      </ul>

      <div className="bm-rating-card">
        <div className="bm-stars">★★★★★</div>
        <div className="bm-rating-num">4.9 / 5</div>
        <div className="bm-rating-label">10,000+ Happy Clients</div>
      </div>

      <div className="bm-delivery-card">
        <span className="bm-delivery-icon">🚀</span>
        <div className="bm-delivery-text">
          <strong>Fast Delivery</strong>
          <span>3–10 Working Days</span>
        </div>
      </div>
    </div>
  );

  /* ── Steps bar ── */
  const StepsBar = (
    <div className="bm-steps">
      {STEPS.map((s, i) => (
        <div key={s} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
          <div className={`bm-step ${i < step ? 'bm-step-done' : i === step ? 'bm-step-active' : ''}`}>
            <div className="bm-step-num">{i < step ? '✓' : i + 1}</div>
            <span className="bm-step-name">{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`bm-step-connector${i < step ? ' bm-step-done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );

  /* ── Step 0: Customer Details ── */
  const Step0 = (
    <>
      <p className="bm-step-title">Customer Information</p>
      <p className="bm-step-subtitle">Tell us about yourself so we can reach you.</p>
      <div className="bm-card">
        <div className="bm-card-title">Personal Details</div>
        <div className="bm-grid">
          <Field label="Full Name" req icon={<FiUser size={15}/>} error={errors.fullName}>
            <input className={`bm-input${errors.fullName?' bm-error':''}`} placeholder="Your full name" value={form.fullName} onChange={e=>set('fullName',e.target.value)} />
          </Field>
          <Field label="Mobile Number" req icon={<FiPhone size={15}/>} error={errors.mobile}>
            <input className={`bm-input${errors.mobile?' bm-error':''}`} placeholder="10-digit mobile number" value={form.mobile} onChange={e=>set('mobile',e.target.value)} />
          </Field>
          <Field label="WhatsApp Number" icon={<FiPhone size={15}/>}>
            <input className="bm-input" placeholder="WhatsApp number" value={form.whatsapp} onChange={e=>set('whatsapp',e.target.value)} />
          </Field>
          <Field label="Email Address" req icon={<FiMail size={15}/>} error={errors.email}>
            <input className={`bm-input${errors.email?' bm-error':''}`} type="email" placeholder="your@email.com" value={form.email} onChange={e=>set('email',e.target.value)} />
          </Field>
          <Field label="Company Name" icon={<FiBriefcase size={15}/>}>
            <input className="bm-input" placeholder="Company name" value={form.company} onChange={e=>set('company',e.target.value)} />
          </Field>
          <Field label="Business Name" icon={<FiBriefcase size={15}/>}>
            <input className="bm-input" placeholder="Business name" value={form.business} onChange={e=>set('business',e.target.value)} />
          </Field>
          <Field label="Website (Optional)" icon={<FiGlobe size={15}/>}>
            <input className="bm-input" placeholder="https://yourwebsite.com" value={form.website} onChange={e=>set('website',e.target.value)} />
          </Field>
          <Field label="City" icon={<FiMapPin size={15}/>}>
            <input className="bm-input" placeholder="City" value={form.city} onChange={e=>set('city',e.target.value)} />
          </Field>
          <Field label="State" icon={<FiMapPin size={15}/>}>
            <input className="bm-input" placeholder="State" value={form.state} onChange={e=>set('state',e.target.value)} />
          </Field>
          <Field label="Country" icon={<FiMapPin size={15}/>}>
            <input className="bm-input" placeholder="Country" value={form.country} onChange={e=>set('country',e.target.value)} />
          </Field>
        </div>
      </div>
    </>
  );

  /* ── Step 1: Project Details ── */
  const Step1 = (
    <>
      <p className="bm-step-title">Project Details</p>
      <p className="bm-step-subtitle">Tell us about your project requirements.</p>

      <div className="bm-card">
        <div className="bm-card-title">Project Information</div>
        <div className="bm-grid">
          <Field label="Project Type" req icon={<FiBriefcase size={15}/>} error={errors.projectType}>
            <select className={`bm-select${errors.projectType?' bm-error':''}`} value={form.projectType} onChange={e=>set('projectType',e.target.value)}>
              <option value="">Select project type</option>
              {PROJECT_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Project Budget" icon={<FiMessageSquare size={15}/>}>
            <select className="bm-select" value={form.budget} onChange={e=>set('budget',e.target.value)}>
              <option value="">Select budget range</option>
              {BUDGETS.map(b=><option key={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Project Timeline" icon={<FiMessageSquare size={15}/>}>
            <select className="bm-select" value={form.timeline} onChange={e=>set('timeline',e.target.value)}>
              <option value="">Select timeline</option>
              {TIMELINES.map(t=><option key={t}>{t}</option>)}
            </select>
          </Field>
          <div className="bm-field bm-grid-full">
            <label className="bm-label">Project Description</label>
            <div className="bm-input-wrap">
              <span className="bm-input-icon" style={{top:14,alignSelf:'flex-start'}}><FiMessageSquare size={15}/></span>
              <textarea className="bm-textarea" placeholder="Describe your project requirements..." value={form.description} onChange={e=>set('description',e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="bm-card">
        <div className="bm-card-title">Services Required</div>
        <div className="bm-checkbox-grid">
          {SERVICES.map(s=>(
            <label key={s} className={`bm-checkbox-item${form.services.includes(s)?' bm-checked':''}`}>
              <input type="checkbox" checked={form.services.includes(s)} onChange={()=>toggleService(s)} />
              {s}
            </label>
          ))}
        </div>
      </div>
    </>
  );

  /* ── Step 2: Upload & Terms ── */
  const Step2 = (
    <>
      <p className="bm-step-title">Upload Files & Terms</p>
      <p className="bm-step-subtitle">Upload any reference files and accept our terms.</p>

      <div className="bm-card">
        <div className="bm-card-title">Upload Files</div>
        <div className="bm-upload-grid">
          <FileBox label="Upload Logo"      hint="JPG, PNG — Max 10MB" name="logoFile"   file={form.logoFile}   onChange={set} />
          <FileBox label="Upload Images"    hint="JPG, PNG — Max 10MB" name="imagesFile" file={form.imagesFile} onChange={set} />
          <FileBox label="Upload Documents" hint="PDF, DOCX — Max 10MB" name="docsFile"  file={form.docsFile}  onChange={set} />
        </div>
      </div>

      <div className="bm-card">
        <div className="bm-card-title">Terms & Conditions</div>
        <label className="bm-consent">
          <input type="checkbox" checked={form.consent} onChange={e=>set('consent',e.target.checked)} />
          I agree to the <a href="#" onClick={e=>e.preventDefault()}>Privacy Policy</a> and <a href="#" onClick={e=>e.preventDefault()}>Terms &amp; Conditions</a>.
        </label>
        {errors.consent && <span className="bm-error-msg" style={{marginTop:6,display:'block'}}>{errors.consent}</span>}
      </div>
    </>
  );

  /* ── Step 3: Confirmation ── */
  const Step3 = (
    <>
      <p className="bm-step-title">Review & Confirm</p>
      <p className="bm-step-subtitle">Please review your details before submitting.</p>

      <div className="bm-summary-card">
        <div className="bm-summary-title">Order Summary</div>
        {[
          ['Name',        form.fullName  || '—'],
          ['Mobile',      form.mobile    || '—'],
          ['Email',       form.email     || '—'],
          ['Project Type',form.projectType || '—'],
          ['Budget',      form.budget    || '—'],
          ['Timeline',    form.timeline  || '—'],
          ['Services',    form.services.length ? form.services.join(', ') : '—'],
          ['Estimated Delivery', '3–10 Working Days'],
          ['Support',     '1 Year Free Support'],
        ].map(([k,v])=>(
          <div className="bm-summary-row" key={k}>
            <span>{k}</span><span>{v}</span>
          </div>
        ))}
      </div>
    </>
  );

  const steps = [Step0, Step1, Step2, Step3];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="bm-backdrop" onClick={onClose}>
      <div className="bm-modal" onClick={e=>e.stopPropagation()}>
        <button className="bm-close" onClick={onClose}><FiX size={20}/></button>

        {/* Left panel — always visible */}
        {LeftPanel}

        {/* Right panel */}
        <div className="bm-right">
          {success ? (
            <div className="bm-success">
              <div className="bm-success-icon">✓</div>
              <h3>Thank You, {form.fullName}! 🎉</h3>
              <p className="bm-success-sub">Booking Submitted Successfully</p>
              <div className="bm-ref-badge">Reference ID: <strong>{serverRef}</strong></div>
              <p>
                Saved in our system. Our team will call you on <strong>{form.mobile}</strong> within <strong>30 minutes</strong>.<br />
                Confirmation email sent to <strong>{form.email}</strong>.
              </p>
              <div className="bm-contact-badge">⏱ Status: Pending &nbsp;&bull;&nbsp; Est. Contact: 30 Minutes</div>
              <div className="bm-success-btns">
                <button className="bm-success-btn-green" onClick={onClose}>
                  <FiArrowLeft size={15}/> Close
                </button>
                <a className="bm-success-btn-wa" href="https://wa.me/918987050207" target="_blank" rel="noreferrer">
                  💬 WhatsApp Support
                </a>
                <button className="bm-success-btn-outline" onClick={()=>window.print()}>
                  <FiDownload size={14}/> Download PDF
                </button>
              </div>
            </div>
          ) : (
            <>
              {StepsBar}
              <form className="bm-form-scroll" onSubmit={handleSubmit} noValidate>
                {steps[step]}
              </form>
              <div className="bm-footer">
                {errors.submit && (
                  <div style={{width:'100%',padding:'10px 14px',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:8,fontSize:13,color:'#dc2626',fontWeight:600,marginBottom:8}}>
                    ⚠️ {errors.submit}
                  </div>
                )}
                {step > 0 && (
                  <button type="button" className="bm-btn-prev" onClick={prev}>
                    <FiArrowLeft size={15}/> Previous
                  </button>
                )}
                {isLast ? (
                  <button type="button" className="bm-btn-submit" onClick={handleSubmit} disabled={submitting}>
                    <FiSend size={15}/> {submitting ? 'Submitting...' : 'Submit Project'}
                  </button>
                ) : (
                  <button type="button" className="bm-btn-next" onClick={next}>
                    Continue <FiArrowRight size={15}/>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
