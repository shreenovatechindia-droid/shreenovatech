import { Link } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';
import '../css/sections.css';

const PLANS = [
  {
    badge: 'BASIC',
    badge_class: 'badge-silver',
    name: 'Basic Website Package',
    price: '₹14,999',
    description: 'Perfect for Business, Portfolio, Personal & Startup Websites.',
    renewal: 'Renewal After 1 Year Only ₹4999',
    features: [
      { text: 'Static Website', included: true },
      { text: 'Responsive Design', included: true },
      { text: 'Up to 5 Pages', included: true },
      { text: '1 Year Free Domain', included: true },
      { text: '2 Business Emails', included: true },
      { text: 'SSL Security', included: true },
      { text: 'Mobile Friendly Design', included: true },
      { text: 'Call / WhatsApp Button', included: true },
      { text: 'Basic SEO Setup', included: true },
      { text: 'Basic Speed Optimization', included: true },
      { text: 'Contact Form', included: true },
      { text: 'Google Map', included: true },
      { text: 'Social Media Integration', included: true },
      { text: 'Payment Gateway Integration', included: true },
      { text: 'Delivery Time 3–5 Days', included: true },
    ],
    notIncluded: ['No Backend', 'No Admin Dashboard'],
    highlight: null,
    is_featured: 0,
  },
  {
    badge: 'DYNAMIC',
    badge_class: 'badge-gold',
    name: 'Dynamic Website Package',
    price: '₹29,999',
    description: 'Perfect for businesses requiring dynamic content.',
    renewal: 'Renewal After 1 Year Only ₹4999',
    features: [
      { text: 'Dynamic Website', included: true },
      { text: 'Responsive Design', included: true },
      { text: 'Up to 10 Pages', included: true },
      { text: '1 Year Free Domain', included: true },
      { text: '5 Business Emails', included: true },
      { text: 'Backend Development', included: true },
      { text: 'Database Integration', included: true },
      { text: 'User Login', included: true },
      { text: 'Contact Management', included: true },
      { text: 'CMS Features', included: true },
      { text: 'Payment Gateway Integration', included: true },
      { text: 'Advanced SEO Setup', included: true },
      { text: 'Advanced Speed Optimization', included: true },
      { text: 'Premium UI / UX', included: true },
      { text: 'Delivery Time 5–7 Days', included: true },
    ],
    notIncluded: ['No Admin Dashboard'],
    highlight: null,
    is_featured: 1,
  },
  {
    badge: 'DIAMOND',
    badge_class: 'badge-diamond',
    name: 'Diamond Package',
    price: '₹49,999',
    description: 'Complete Business Solution.',
    renewal: 'Renewal After 1 Year Only ₹4999',
    features: [
      { text: 'Dynamic Website', included: true },
      { text: 'Premium UI / UX Design', included: true },
      { text: 'Unlimited Pages', included: true },
      { text: '1 Year Free Domain', included: true },
      { text: 'Unlimited Business Emails', included: true },
      { text: 'Backend Development', included: true },
      { text: 'Admin Dashboard', included: true },
      { text: 'Database Integration', included: true },
      { text: 'User Management', included: true },
      { text: 'Booking Management', included: true },
      { text: 'Payment Management', included: true },
      { text: 'Analytics Dashboard', included: true },
      { text: 'Blog Management', included: true },
      { text: 'Gallery Management', included: true },
      { text: 'SEO Management', included: true },
      { text: 'API Integration', included: true },
      { text: 'WhatsApp Integration', included: true },
      { text: 'Email Integration', included: true },
      { text: 'Security Features', included: true },
      { text: 'Premium SEO Setup', included: true },
      { text: 'Premium Speed Optimization', included: true },
      { text: 'Lifetime Code Quality', included: true },
      { text: 'Delivery Time 7–10 Days', included: true },
    ],
    notIncluded: [],
    highlight: '✅ Backend + Admin Dashboard Included — All Premium Features Included',
    is_featured: 0,
  },
];

const BADGES = [
  { icon: '🌐', title: '1 Year Free Domain', sub: 'With all packages' },
  { icon: '🔒', title: 'SSL Security', sub: 'For all websites' },
  { icon: '💬', title: '24/7 Support', sub: 'We are always here' },
  { icon: '🚀', title: 'On-Time Delivery', sub: '100% on-time delivery' },
  { icon: '✅', title: 'No Hidden Charges', sub: 'Transparent pricing' },
];

export default function Pricing() {
  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-container">
        <h2 className="pricing-heading">Choose the Best Package for Your Business</h2>
        <p className="pricing-subtitle">
          All packages include quality design, on-time delivery &amp; 100% satisfaction.
        </p>

        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <div className={`pc ${plan.is_featured ? 'pc-featured' : ''}`} key={plan.badge} data-aos="fade-up">
              {!!plan.is_featured && <div className="pc-ribbon">⭐ MOST POPULAR</div>}

              <div className="pc-top">
                <span className={`pc-badge ${plan.badge_class}`}>✦ {plan.badge}</span>
                <h3 className="pc-name">{plan.name}</h3>
                <div className="pc-price">{plan.price}</div>
                <div className="pc-renewal">{plan.renewal}</div>
                <p className="pc-desc">{plan.description}</p>
              </div>

              <div className="pc-divider" />

              <ul className="pc-features">
                {plan.features.map(f => (
                  <li key={f.text}>
                    <FiCheck className="pc-check" size={13} />
                    {f.text}
                  </li>
                ))}
              </ul>

              {plan.notIncluded.length > 0 && (
                <div className="pc-not-included">
                  {plan.notIncluded.map(t => (
                    <div key={t} className="pc-not-row">
                      <FiX className="pc-cross" size={13} />
                      {t}
                    </div>
                  ))}
                </div>
              )}

              {plan.highlight && (
                <div className="pc-highlight">{plan.highlight}</div>
              )}

              <Link to={`/payment?package=${plan.badge.toLowerCase()}`} className="pc-btn">Get Started</Link>
            </div>
          ))}
        </div>

        <div className="pricing-badges" data-aos="fade-up">
          {BADGES.map(b => (
            <div className="pricing-badge-item" key={b.title}>
              <span className="pricing-badge-icon">{b.icon}</span>
              <span className="pricing-badge-title">{b.title}</span>
              <span className="pricing-badge-sub">{b.sub}</span>
            </div>
          ))}
        </div>

        <div className="pricing-cta-wrap" data-aos="fade-up">
          <Link to="/book-now" className="pricing-slot-btn">Book Your Slot →</Link>
        </div>
      </div>
    </section>
  );
}
