import { useEffect, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import '../css/sections.css';

const features = [
  'Free Domain',          'Free Hosting',
  '5 Pages Website',      'Responsive Design',
  '1 Year Free Maintenance', '100% Client Satisfaction',
];

function useCountdown(targetDate) {
  const calc = () => {
    const diff = targetDate - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours:   Math.floor(diff / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

export default function Hero() {
  const target = new Date(Date.now() + 15 * 3600000 + 54 * 60000 + 30000);
  const { hours, minutes, seconds } = useCountdown(target);

  return (
    <section className="hero-section">
      <div className="hero-inner">
        <div className="hero-left" data-aos="fade-right">
          <h1 className="hero-title">
            Start Your Website In Just
            <span className="hero-title-row2">
              <span className="price-highlight">₹9,999 INR!</span>
              <span className="offer-text"> Limited Time Offer</span>
            </span>
          </h1>

          <ul className="hero-features">
            {features.map(f => (
              <li key={f}>
                <span className="hero-check">✔</span> {f}
              </li>
            ))}
          </ul>

          <div className="countdown-wrap">
            {[['Hours', hours], ['Minutes', minutes], ['Seconds', seconds]].map(([label, val], i) => (
              <>
                <div className="countdown-box" key={label}>
                  <div className="num">{String(val).padStart(2, '0')}</div>
                  <div className="cd-label">{label}</div>
                </div>
                {i < 2 && <span className="countdown-sep" key={`sep${i}`}>:</span>}
              </>
            ))}
          </div>

          <div className="hero-cta-wrap">
            <Link to="/book-now" className="btn-green hero-btn">
              Book Your Slot <FiArrowRight />
            </Link>
            <span className="hero-slots">Only 9 Slots Available – Don't Miss Out!</span>
          </div>
        </div>

        <div className="hero-right" data-aos="fade-left">
          <div className="hero-img-wrap">
            <img
              src="/d.png"
              alt="ShreeNova Tech Website Development"
              className="hero-image floating"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
