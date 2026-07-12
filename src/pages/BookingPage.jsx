import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { submitBooking } from '../utils/api';
import {
  FiArrowRight, FiArrowLeft, FiSend, FiDownload,
  FiUser, FiPhone, FiMail, FiBriefcase,
  FiMessageSquare, FiUpload, FiCheck,
} from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import './BookingPage.css';

/* ── Constants ── */
const PROJECT_TYPES = [
  'Business Website','E-Commerce Website','Portfolio Website',
  'School Website','Hospital Website','Restaurant Website',
  'Real Estate Website','Corporate Website','Landing Page','Custom Website',
];
const SERVICES = [
  'Website Development','Mobile App','Hosting',
  'SEO','Digital Marketing',
];
const BUDGETS = ['₹5,000 – ₹10,000','₹10,000 – ₹25,000','₹25,000 – ₹50,000','₹50,000+'];
const ACCEPT  = '.jpg,.jpeg,.png,.pdf,.docx';
const MAX_MB  = 10;

const STEPS = [
  { label: 'Customer',  icon: '👤' },
  { label: 'Project',   icon: '📋' },
  { label: 'Review',    icon: '✅' },
];

const empty = {
  fullName:'', mobile:'', email:'', company:'',
  projectType:'', budget:'', description:'',
  services:[], consent:false,
  logoFile:null, imagesFile:null,
  /* kept for backend compat */
  whatsapp:'', business:'', website:'', city:'', state:'', country:'', timeline:'',
};

/* ── Validation ── */
function validateStep(step, f) {
  const e = {};
  if (step === 0) {
    if (!f.fullName.trim()) e.fullName = 'Full name is required.';
    if (!f.mobile.trim())   e.mobile   = 'Mobile number is required.';
    else if (!/^[6-9]\d{9}$/.test(f.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number.';
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

const genRef = () => 'SNT-' + Date.now().toString(36).toUpperCase();

/* ── Field wrapper ── */
function Field({ label, req, error, icon, children }) {
  return (
    <div className="bp-field">
      <label className="bp-label">{label}{req && <span className="bp-req">*</span>}</label>
      <div className="bp-input-wrap">
        {icon && <span className="bp-input-icon">{icon}</span>}
        {children}
      </div>
      {error && <span className="bp-err-msg">{error}</span>}
    </div>
  );
}

/* ── File upload box ── */
function FileBox({ label, hint, name, file, onChange }) {
  const ref = useRef();
  return (
    <div className="bp-upload-box" onClick={() => ref.current.click()}>
      <input ref={ref} type="file" accept={ACCEPT}
        onChange={e => {
          const f = e.target.files[0];
          if (f && f.size > MAX_MB * 1024 * 1024) { alert(`Max file size is ${MAX_MB}MB.`); return; }
          onChange(name, f || null);
        }}
      />
      <span className="bp-upload-icon"><FiUpload size={20} /></span>
      <span className="bp-upload-label">{label}</span>
      {file
        ? <span className="bp-upload-name">✓ {file.name}</span>
        : <span className="bp-upload-hint">{hint}</span>
      }
    </div>
  );
}

/* ── Sticky Summary Card ── */
function SummaryCard({ form }) {
  const budget = form.budget || '—';
  return (
    <div className="bp-summary-sticky">
      <div className="bp-summary-header">
        <span className="bp-summary-title">Project Summary</span>
        <span className="bp-summary-badge">Live Preview</span>
      </div>

      {form.services.length > 0 && (
        <div className="bp-summary-block">
          <div className="bp-summary-block-label">Selected Services</div>
          <div className="bp-summary-tags">
            {form.services.map(s => (
              <span key={s} className="bp-summary-tag">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div className="bp-summary-rows">
        <div className="bp-summary-row">
          <span>💰 Budget</span>
          <span>{budget}</span>
        </div>
        <div className="bp-summary-row">
          <span>🚀 Delivery</span>
          <span>3–10 Days</span>
        </div>
        <div className="bp-summary-row">
          <span>🎁 Support</span>
          <span>1 Year Free</span>
        </div>
        <div className="bp-summary-row">
          <span>🛡️ Helpdesk</span>
          <span>24×7 Support</span>
        </div>
      </div>

      <div className="bp-summary-divider" />

      <div className="bp-summary-trust">
        <div className="bp-summary-stars">★★★★★</div>
        <div className="bp-summary-trust-text">4.9/5 · 10,000+ Happy Clients</div>
      </div>

      <a href="https://wa.me/918987050207" target="_blank" rel="noreferrer" className="bp-summary-wa">
        💬 Chat on WhatsApp
      </a>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function BookingPage() {
  const [form, setForm]         = useState(empty);
  const [errors, setErrors]     = useState({});
  const [step, setStep]         = useState(0);
  const [success, setSuccess]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverRef, setServerRef]   = useState('');
  const [ref]                       = useState(genRef);

  useEffect(() => { window.scrollTo(0, 0); }, []);

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
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prev = () => {
    setErrors({});
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validateStep(2, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('fullName',    form.fullName);
      fd.append('mobile',      form.mobile);
      fd.append('whatsapp',    form.mobile);
      fd.append('email',       form.email);
      fd.append('company',     form.company);
      fd.append('business',    form.company);
      fd.append('website',     '');
      fd.append('city',        '');
      fd.append('state',       '');
      fd.append('country',     'India');
      fd.append('projectType', form.projectType);
      fd.append('budget',      form.budget);
      fd.append('timeline',    'Flexible');
      fd.append('description', form.description);
      fd.append('services',    JSON.stringify(form.services));
      if (form.logoFile)   fd.append('logoFile',   form.logoFile);
      if (form.imagesFile) fd.append('imagesFile', form.imagesFile);

      const res = await submitBooking(fd);
      setServerRef(res.data?.data?.ref_id || '');
      setSuccess(true);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Submission failed. Please try again.';
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* ── Progress Bar ── */
  const ProgressBar = (
    <div className="bp-progress-wrap">
      {STEPS.map((s, i) => (
        <div key={s.label} className="bp-progress-item">
          <div className={`bp-progress-step ${i < step ? 'bp-prog-done' : i === step ? 'bp-prog-active' : ''}`}>
            {i < step ? <FiCheck size={14} /> : <span>{s.icon}</span>}
          </div>
          <span className={`bp-progress-label ${i === step ? 'bp-prog-label-active' : ''}`}>{s.label}</span>
          {i < STEPS.length - 1 && (
            <div className={`bp-progress-line ${i < step ? 'bp-prog-line-done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );

  /* ── Step 0: Customer Details ── */
  const Step0 = (
    <>
      <div className="bp-step-head">
        <h2 className="bp-step-title">Customer Details</h2>
        <p className="bp-step-subtitle">Tell us about yourself so we can reach you.</p>
      </div>
      <div className="bp-card">
        <div className="bp-card-title">Personal Information</div>
        <div className="bp-grid">
          <Field label="Full Name" req icon={<FiUser size={15}/>} error={errors.fullName}>
            <input className={`bp-input${errors.fullName?' bp-err':''}`} placeholder="Your full name" value={form.fullName} onChange={e=>set('fullName',e.target.value)} />
          </Field>
          <Field label="Mobile Number" req icon={<FiPhone size={15}/>} error={errors.mobile}>
            <input className={`bp-input${errors.mobile?' bp-err':''}`} placeholder="10-digit mobile number" value={form.mobile} onChange={e=>set('mobile',e.target.value)} />
          </Field>
          <Field label="Email Address" req icon={<FiMail size={15}/>} error={errors.email}>
            <input className={`bp-input${errors.email?' bp-err':''}`} type="email" placeholder="your@email.com" value={form.email} onChange={e=>set('email',e.target.value)} />
          </Field>
          <Field label="Company Name (Optional)" icon={<FiBriefcase size={15}/>}>
            <input className="bp-input" placeholder="Your company or business name" value={form.company} onChange={e=>set('company',e.target.value)} />
          </Field>
        </div>
      </div>
      <div className="bp-btns">
        <Link to="/" className="bp-btn-prev"><FiArrowLeft size={15}/> Back</Link>
        <button type="button" className="bp-btn-next" onClick={next}>
          Continue <FiArrowRight size={15}/>
        </button>
      </div>
    </>
  );

  /* ── Step 1: Project Details ── */
  const Step1 = (
    <>
      <div className="bp-step-head">
        <h2 className="bp-step-title">Project Details</h2>
        <p className="bp-step-subtitle">Tell us about your project requirements.</p>
      </div>

      <div className="bp-card">
        <div className="bp-card-title">Project Information</div>
        <div className="bp-grid">
          <Field label="Project Type" req icon={<FiBriefcase size={15}/>} error={errors.projectType}>
            <select className={`bp-select${errors.projectType?' bp-err':''}`} value={form.projectType} onChange={e=>set('projectType',e.target.value)}>
              <option value="">Select project type</option>
              {PROJECT_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Budget" icon={<FiMessageSquare size={15}/>}>
            <select className="bp-select" value={form.budget} onChange={e=>set('budget',e.target.value)}>
              <option value="">Select budget range</option>
              {BUDGETS.map(b=><option key={b}>{b}</option>)}
            </select>
          </Field>
          <div className="bp-field bp-grid-full">
            <label className="bp-label">Project Description</label>
            <div className="bp-input-wrap">
              <span className="bp-input-icon" style={{alignSelf:'flex-start',top:16}}><FiMessageSquare size={15}/></span>
              <textarea className="bp-textarea" placeholder="Describe your project — goals, features, references..." value={form.description} onChange={e=>set('description',e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="bp-card">
        <div className="bp-card-title">Services Required</div>
        <div className="bp-checkbox-grid">
          {SERVICES.map(s=>(
            <label key={s} className={`bp-checkbox-item${form.services.includes(s)?' bp-checked':''}`}>
              <input type="checkbox" checked={form.services.includes(s)} onChange={()=>toggleService(s)} />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div className="bp-card">
        <div className="bp-card-title">Upload Files</div>
        <div className="bp-upload-grid">
          <FileBox label="Upload Logo"             hint="JPG, PNG — Max 10MB" name="logoFile"   file={form.logoFile}   onChange={set} />
          <FileBox label="Upload Reference Images" hint="JPG, PNG — Max 10MB" name="imagesFile" file={form.imagesFile} onChange={set} />
        </div>
      </div>

      <div className="bp-btns">
        <button type="button" className="bp-btn-prev" onClick={prev}><FiArrowLeft size={15}/> Previous</button>
        <button type="button" className="bp-btn-next" onClick={next}>Continue <FiArrowRight size={15}/></button>
      </div>
    </>
  );

  /* ── Step 2: Review ── */
  const Step2 = (
    <>
      <div className="bp-step-head">
        <h2 className="bp-step-title">Review & Submit</h2>
        <p className="bp-step-subtitle">Please review your details before submitting.</p>
      </div>

      <div className="bp-card">
        <div className="bp-card-title">Order Summary</div>
        <div className="bp-review-grid">
          {[
            ['👤 Full Name',    form.fullName    || '—'],
            ['📱 Mobile',       form.mobile      || '—'],
            ['✉️ Email',        form.email       || '—'],
            ['🏢 Company',      form.company     || '—'],
            ['📋 Project Type', form.projectType || '—'],
            ['💰 Budget',       form.budget      || '—'],
            ['🛠️ Services',     form.services.length ? form.services.join(', ') : '—'],
            ['🚀 Delivery',     '3–10 Working Days'],
            ['🎁 Support',      '1 Year Free Support'],
          ].map(([k,v])=>(
            <div className="bp-review-row" key={k}>
              <span className="bp-review-key">{k}</span>
              <span className="bp-review-val">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bp-card">
        <div className="bp-card-title">Terms & Conditions</div>
        <label className="bp-consent">
          <input type="checkbox" checked={form.consent} onChange={e=>set('consent',e.target.checked)} />
          <span>I agree to the <a href="#" onClick={e=>e.preventDefault()}>Privacy Policy</a> and <a href="#" onClick={e=>e.preventDefault()}>Terms &amp; Conditions</a> of ShreeNova Tech.</span>
        </label>
        {errors.consent && <span className="bp-err-msg" style={{marginTop:8,display:'block'}}>{errors.consent}</span>}
      </div>

      <div className="bp-btns">
        <button type="button" className="bp-btn-prev" onClick={prev}><FiArrowLeft size={15}/> Previous</button>
        <button type="button" className="bp-btn-submit" onClick={handleSubmit} disabled={submitting}>
          <FiSend size={15}/> {submitting ? 'Submitting...' : 'Submit Project'}
        </button>
      </div>
      {errors.submit && (
        <div style={{marginTop:12,padding:'12px 16px',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,fontSize:13,color:'#dc2626',fontWeight:600}}>
          ⚠️ {errors.submit}
        </div>
      )}
    </>
  );

  const steps = [Step0, Step1, Step2];

  return (
    <MainLayout>
      <div className="bp-page">
        <div className="bp-container">

          {/* Header */}
          <div className="bp-header">
            <div className="bp-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>Book Your Project</span>
            </div>
            <h1 className="bp-title">Start Your <span>Digital Project</span></h1>
            <p className="bp-subtitle">Fill in your details — our team will contact you within 30 minutes.</p>
          </div>

          {/* Progress Bar */}
          {!success && ProgressBar}

          {/* Success */}
          {success ? (
            <div className="bp-success">
              <div className="bp-success-icon">✓</div>
              <h2>Booking Submitted!</h2>
              <p className="bp-success-sub">Thank you, {form.fullName}! 🎉</p>
              <div className="bp-ref-badge">Reference ID: <strong>{serverRef}</strong></div>
              <p>
                Your booking is saved in our system.<br />
                Our team will contact you on <strong>{form.mobile}</strong> within <strong>30 minutes</strong>.<br />
                A confirmation email has been sent to <strong>{form.email}</strong>.
              </p>
              <div className="bp-contact-badge">⏱ Status: Pending &nbsp;&bull;&nbsp; Estimated Contact: Within 30 Minutes</div>
              <div className="bp-success-btns">
                <Link to="/" className="bp-success-btn-green"><FiArrowLeft size={15}/> Go Home</Link>
                <a className="bp-success-btn-wa" href="https://wa.me/918987050207" target="_blank" rel="noreferrer">💬 WhatsApp Support</a>
                <button className="bp-success-btn-outline" onClick={() => window.print()}><FiDownload size={14}/> Download PDF</button>
              </div>
            </div>
          ) : (
            <div className="bp-body">
              <div className="bp-right">{steps[step]}</div>
              <div className="bp-sidebar"><SummaryCard form={form} /></div>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}
