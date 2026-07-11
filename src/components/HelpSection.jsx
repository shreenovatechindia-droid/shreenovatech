import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import '../css/sections.css';

export default function HelpSection() {
  return (
    <section className="help-section">
      <div className="help-container">
        <h2 className="help-heading" data-aos="fade-up">Need Immediate Help?</h2>
        <p className="help-subtitle" data-aos="fade-up" data-aos-delay="80">
          Our team is available 24/7. WhatsApp us or email using the details below, and<br />
          we'll resolve your issues quickly and professionally.
        </p>
        <div className="help-btns" data-aos="fade-up" data-aos-delay="160">
          <a
            href="https://wa.me/918987050207"
            target="_blank"
            rel="noreferrer"
            className="help-btn"
          >
            <span className="help-btn-icon"><FaWhatsapp size={22} /></span>
            <span className="help-btn-text">WhatsApp Us: +91-89870 50207</span>
          </a>
          <a
            href="mailto:support@shreenovatech.in"
            className="help-btn"
          >
            <span className="help-btn-icon"><FaEnvelope size={20} /></span>
            <span className="help-btn-text">Email: support@shreenovatech.in</span>
          </a>
        </div>
      </div>
    </section>
  );
}
