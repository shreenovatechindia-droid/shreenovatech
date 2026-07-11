import { useState, useEffect } from 'react';
import { FiPlus, FiMinus, FiMail, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { submitContact, getFaqs } from '../utils/api';
import '../css/sections.css';

const FALLBACK_FAQS = [
  { question:'How long does it take to build a website?', answer:'We typically deliver a fully designed website within 5 to 10 business days after receiving all required details and advance payment.' },
  { question:'Do you provide domain and hosting?', answer:'Yes! All our packages include 1 Year Free Domain and 1 Year Free Hosting as part of the offer.' },
  { question:'Can I update my website easily?', answer:'Absolutely. We build websites with easy-to-use CMS so you can update content anytime without technical knowledge.' },
  { question:'What is the payment process?', answer:'We require a 50% advance payment to book your slot. The remaining 50% is due before the website goes live.' },
];

function FAQ() {
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    getFaqs('general')
      .then(r => { if (r.data?.data?.length) setFaqs(r.data.data); })
      .catch(() => {});
  }, []);

  return (
    <div>
      <h4 className="mb-3" style={{fontWeight:700}}>
        Frequently Asked <span className="text-green">Questions</span>
      </h4>
      {faqs.map((f, i) => (
        <div className="faq-item" key={i}>
          <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
            {f.question}
            {open === i ? <FiMinus size={16} /> : <FiPlus size={16} />}
          </button>
          {open === i && <div className="faq-answer">{f.answer}</div>}
        </div>
      ))}
    </div>
  );
}

function ContactForm() {
  const [form, setForm]     = useState({ name:'', email:'', phone:'', message:'' });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const handle = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => { const n = { ...p }; delete n[name]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required.';
    if (!form.email.trim())   e.email   = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email.';
    if (!form.message.trim()) e.message = 'Message is required.';
    return e;
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus('sending');
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name:'', email:'', phone:'', message:'' });
    } catch (err) {
      setStatus(err?.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="row g-3">
        <div className="col-6">
          <input name="name" placeholder="Your Name *" value={form.name} onChange={handle} style={errors.name ? {borderColor:'#EF4444'} : {}} />
          {errors.name && <small style={{color:'#EF4444',fontSize:11}}>{errors.name}</small>}
        </div>
        <div className="col-6">
          <input name="email" type="email" placeholder="Your Email *" value={form.email} onChange={handle} style={errors.email ? {borderColor:'#EF4444'} : {}} />
          {errors.email && <small style={{color:'#EF4444',fontSize:11}}>{errors.email}</small>}
        </div>
        <div className="col-12">
          <input name="phone" placeholder="Your Phone" value={form.phone} onChange={handle} />
        </div>
        <div className="col-12">
          <textarea name="message" placeholder="Your Message *" value={form.message} onChange={handle} style={errors.message ? {borderColor:'#EF4444'} : {}} />
          {errors.message && <small style={{color:'#EF4444',fontSize:11}}>{errors.message}</small>}
        </div>

        {status === 'success' && (
          <div className="col-12">
            <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10, padding:'12px 16px', color:'#15803D', fontWeight:600, fontSize:14, display:'flex', alignItems:'center', gap:8 }}>
              ✓ Thank you! Your message has been sent successfully.
            </div>
          </div>
        )}

        {status !== 'idle' && status !== 'sending' && status !== 'success' && (
          <div className="col-12">
            <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'12px 16px', color:'#DC2626', fontWeight:600, fontSize:13, display:'flex', alignItems:'center', gap:8 }}>
              ✗ {status}
            </div>
          </div>
        )}

        <div className="col-12">
          <button type="submit" className="btn-green w-100 justify-content-center" disabled={status === 'sending'} style={status === 'sending' ? {opacity:0.75,cursor:'not-allowed'} : {}}>
            <FiSend size={15} />
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <h2 className="section-title">
          Need Immediate <span className="text-green">Help?</span>
        </h2>
        <p className="section-subtitle">
          Our team is available 24/7 via WhatsApp or email. We will resolve your issues quickly and professionally.
        </p>
        <div className="row g-4">
          <div className="col-lg-4" data-aos="fade-right">
            <div className="help-card">
              <h4>Frequently Asked <span className="text-green">Questions</span></h4>
              <FAQ />
            </div>
            <div className="d-flex gap-3 mt-3">
              <a href="https://wa.me/918987050207" className="btn-green flex-fill justify-content-center">
                <FaWhatsapp size={18} /> WhatsApp Us
              </a>
              <a href="mailto:support@shreenovatech.in" className="btn-orange flex-fill justify-content-center">
                <FiMail size={16} /> Email Us
              </a>
            </div>
          </div>

          <div className="col-lg-4" data-aos="fade-up">
            <div className="help-card">
              <h4>Send Us a <span className="text-green">Message</span></h4>
              <p>Fill the form and we'll get back to you within 24 hours.</p>
              <ContactForm />
            </div>
          </div>

          <div className="col-lg-4" data-aos="fade-left">
            <div className="help-card">
              <h4>Our <span className="text-green">Location</span></h4>
              <p>Bisanpura, Sector 58, Noida, Uttar Pradesh 201301, India</p>
              <div className="map-wrap mt-3">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.3!2d77.3710!3d28.6270!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a9b5555555%3A0x1234567890abcdef!2sBisanpura%2C%20Sector%2058%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%" height="420"
                  style={{ border:0, borderRadius:20, display:'block' }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ShreeNova Tech Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
