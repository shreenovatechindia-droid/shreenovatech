import { Link } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';
import '../css/sections.css';

const PLANS = [
  {
    badge: 'BASIC', badge_class: 'badge-silver',
    name: 'Basic Website Package',
    description: 'Perfect for businesses needing a clean static online presence.',
    price: '₹14,999',
    renewal: 'Renewal After 1 Year Only ₹4999',
    is_featured: 0,
    features: [
      { text: '1 Year Free Domain', included: true },
      { text: 'Static Website', included: true },
      { text: 'No Backend', included: true },
      { text: 'Admin Dashboard', included: false },
    ],
  },
  {
    badge: 'DYNAMIC', badge_class: 'badge-gold',
    name: 'Dynamic Website Package',
    description: 'Perfect for startups & businesses needing a dynamic web solution.',
    price: '₹29,999',
    renewal: 'Renewal After 1 Year Only ₹4999',
    is_featured: 1,
    features: [
      { text: '1 Year Free Domain', included: true },
      { text: 'Dynamic Website', included: true },
      { text: 'Backend Included', included: true },
      { text: 'Admin Dashboard', included: false },
    ],
  },
  {
    badge: 'DIAMOND', badge_class: 'badge-diamond',
    name: 'Diamond Package',
    description: 'Perfect for advanced & fully customized web applications.',
    price: '₹49,999',
    renewal: 'Renewal After 1 Year Only ₹4999',
    is_featured: 0,
    features: [
      { text: '1 Year Free Domain', included: true },
      { text: 'Dynamic Website', included: true },
      { text: 'Backend Included', included: true },
      { text: 'Admin Dashboard Included', included: true },
    ],
  },
];

export default function Pricing() {
  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-container">
        <h2 className="pricing-heading">Choose Your Perfect Business Plan</h2>
        <p className="pricing-subtitle">
          Choose the perfect plan for your business with no hidden charges<br />
          because we believe in honesty and transparency.
        </p>
        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <div className={`pc ${plan.is_featured ? 'pc-featured' : ''}`} key={plan.badge} data-aos="fade-up">
              {!!plan.is_featured && <div className="pc-ribbon">⭐ MOST POPULAR</div>}
              <div className="pc-top">
                <span className={`pc-badge ${plan.badge_class}`}>✦ {plan.badge}</span>
                <h3 className="pc-name">{plan.name}</h3>
                <p className="pc-desc">{plan.description}</p>
                <div className="pc-price">{plan.price}</div>
                <div className="pc-renewal">{plan.renewal}</div>
              </div>
              <div className="pc-divider" />
              <ul className="pc-features">
                {plan.features.map(f => (
                  <li key={f.text}>
                    {f.included
                      ? <FiCheck className="pc-check" size={14} />
                      : <FiX className="pc-cross" size={14} />}
                    {f.text}
                  </li>
                ))}
              </ul>
              <Link to={`/payment?package=${plan.badge.toLowerCase()}`} className="pc-btn">Get Started</Link>
            </div>
          ))}
        </div>
        <div className="pricing-cta-wrap" data-aos="fade-up">
          <Link to="/book-now" className="pricing-slot-btn">
            Book Your Slot →
          </Link>
        </div>
      </div>
    </section>
  );
}
