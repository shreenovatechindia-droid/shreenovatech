import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import '../css/sections.css';

const quickLinks = [
  { label: 'Home',       path: '/' },
  { label: 'About Us',   path: '/about' },
  { label: 'Portfolio',  path: '/#portfolio', hash: 'portfolio' },
  { label: 'Pricing',    path: '/#pricing',   hash: 'pricing' },
  { label: 'Contact Us', path: '/#contact',   hash: 'contact' },
];
const services = [
  { label: 'Web Hosting',             path: '/shared-hosting' },
  { label: 'Cloud Hosting',           path: '/cloud-hosting' },
  { label: 'Domain Registration',     path: '/shared-hosting' },
  { label: 'Website Design',          path: '/business-website' },
  { label: 'Ecommerce Development',   path: '/ecommerce-website' },
  { label: 'SEO Services',            path: '/seo-services' },
];
const support = [
  { label: 'FAQ',                path: '/#contact',  hash: 'contact' },
  { label: 'Help Center',        path: '/#contact',  hash: 'contact' },
  { label: 'Terms & Conditions', path: '/#contact' },
  { label: 'Privacy Policy',     path: '/#contact' },
  { label: 'Refund Policy',      path: '/#contact' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);
  const navigate = useNavigate();

  const handleHashLink = (item) => {
    if (item.hash) {
      const el = document.getElementById(item.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => document.getElementById(item.hash)?.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-5">
          {/* Brand */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src="/logo1.png" alt="ShreeNova Tech" style={{height:'110px', width:'auto', maxWidth:'250px', objectFit:'contain', mixBlendMode:'screen'}} />
            </div>
            <p>ShreeNova Tech is a leading provider of web hosting, website development, and digital marketing solutions to grow your online presence.</p>
            <div className="footer-social">
              <a href="https://www.facebook.com/share/18xY2ZRtuc/"><FaFacebook /></a>
              <a href="https://www.instagram.com/shreenovatech_official?igsh=aDg4eDcyYmo5bnF0"><FaInstagram /></a>
              <a href="https://youtube.com/@shreenovatechofficial?si=EG-ogLD5qQ2tO8j1"><FaYoutube /></a>
              <a href="https://www.linkedin.com/company/shreenovatech"><FaLinkedin /></a>
              <a href="https://wa.me/918987050207"><FaWhatsapp /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              {quickLinks.map(l => (
                <li key={l.label}>
                  {l.hash
                    ? <a href={l.path} onClick={e => { e.preventDefault(); handleHashLink(l); }}>{l.label}</a>
                    : <Link to={l.path}>{l.label}</Link>
                  }
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-2 col-md-6">
            <h5>Our Services</h5>
            <ul className="footer-links">
              {services.map(s => (
                <li key={s.label}><Link to={s.path}>{s.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-6">
            <h5>Support</h5>
            <ul className="footer-links">
              {support.map(s => (
                <li key={s.label}>
                  {s.hash
                    ? <a href={s.path} onClick={e => { e.preventDefault(); handleHashLink(s); }}>{s.label}</a>
                    : <Link to={s.path}>{s.label}</Link>
                  }
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h5>Contact Us</h5>
            <div className="footer-contact-item"><FiPhone /><span>+91 89870 50207</span></div>
            <div className="footer-contact-item"><FiMail /><span>support@shreenovatech.in</span></div>
            <div className="footer-contact-item"><FiMapPin /><span>www.shreenovatech.in</span></div>
            <div className="footer-contact-item"><FiMapPin /><span>Noida, Uttar Pradesh, India</span></div>
            <div className="footer-newsletter mt-3">
              <h5 style={{fontSize:'0.9rem',marginBottom:'10px'}}>Newsletter</h5>
              <input
                type="email" placeholder="Enter your email"
                value={email} onChange={e => setEmail(e.target.value)}
              />
              <button
                className="btn-green w-100 justify-content-center"
                onClick={() => { setSubbed(true); setEmail(''); setTimeout(() => setSubbed(false), 3000); }}
              >
                {subbed ? '✓ Subscribed!' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} ShreeNova Tech. All Rights Reserved. Designed with ❤️ in India.By AMIT RANJAN.
        </div>
      </div>

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/918987050207"
        style={{
          position:'fixed', bottom:24, right:24, zIndex:9999,
          background:'#25d366', color:'#fff', width:54, height:54,
          borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:26, boxShadow:'0 4px 20px rgba(37,211,102,0.4)',
          textDecoration:'none', transition:'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
      >
        <FaWhatsapp />
      </a>
    </footer>
  );
}
