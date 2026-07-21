import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import './FloatingContactWidget.css';

export default function FloatingContactWidget() {
  const [hovered, setHovered] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fcw-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Need Help bubble */}
      <div className={`fcw-bubble${showBubble ? ' fcw-bubble--visible' : ''}`}>
        <span>Need Help?</span>
        <span>Contact Us 24×7</span>
      </div>

      {/* Call Button */}
      <div className={`fcw-item${hovered ? ' fcw-item--expanded' : ''}`}>
        {hovered && (
          <span className="fcw-label fcw-label--slide">📞 Call Us</span>
        )}
        <a
          href="tel:+918987050207"
          className="fcw-btn"
          aria-label="Call Us"
        >
          <FiPhone size={26} />
        </a>
      </div>

      {/* WhatsApp Button */}
      <div className={`fcw-item${hovered ? ' fcw-item--expanded' : ''}`}>
        {hovered && (
          <span className="fcw-label fcw-label--slide">💬 WhatsApp</span>
        )}
        <a
          href="https://wa.me/919898705207"
          target="_blank"
          rel="noopener noreferrer"
          className="fcw-btn"
          aria-label="WhatsApp Us"
        >
          <FaWhatsapp size={28} />
        </a>
      </div>
    </div>
  );
}
