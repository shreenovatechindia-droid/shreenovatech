import { useState, useEffect } from 'react';
import { FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getPricing } from '../utils/api';
import '../css/sections.css';

const FALLBACK = [
  { badge:'SILVER', badge_class:'badge-silver', name:'Silver Package', description:'Perfect for Beginners & simple blog sites.', price:'₹9,999', renewal:'Renewal After 1 Year Only ₹2500', is_featured:0, features:['1 Year Free Domain','1 Year Free Hosting','Up to 5 Pages','2 Business Emails','SSL Security','Mobile / Friendly Design','Call / Chat Button','Basic SEO Setup','Basic Speed Optimization','Basic Support','Delivery Time 3-5 Days','Payment & Shipping Integration'] },
  { badge:'GOLDEN', badge_class:'badge-gold',   name:'Golden Package', description:'Perfect for startups & e-commerce sites.', price:'₹14,999', renewal:'Renewal After 1 Year Only ₹2500', is_featured:1, features:['1 Year Free Domain','1 Year Free Hosting','Up to 5 to 10 Pages','5 Business Emails','SSL Security','Mobile Friendly Design','Call / Chat Button','Advanced SEO Setup','Advanced Speed Optimization','Advanced Support','Delivery Time 5-7 Days','Payment & Shipping Integration'] },
  { badge:'DIAMOND', badge_class:'badge-diamond', name:'Diamond Package', description:'Perfect for Advance & Customized sites.', price:'₹19,999', renewal:'Renewal After 1 Year Only ₹2500', is_featured:0, features:['1 Year Free Domain','1 Year Free Hosting','Up to 10 to 15 Pages','Unlimited Business Emails','SSL Security','Mobile Friendly Design','Call / Chat Button','Premium SEO Setup','Premium Speed Optimization','Premium Support','Delivery Time 7-10 Days','Payment & Shipping Integration'] },
];

export default function Pricing() {
  const [plans, setPlans] = useState(FALLBACK);

  useEffect(() => {
    getPricing()
      .then(r => { if (r.data?.data?.length) setPlans(r.data.data); })
      .catch(() => {});
  }, []);

  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-container">
        <h2 className="pricing-heading">Choose Your Perfect Business Plan</h2>
        <p className="pricing-subtitle">
          Choose the perfect plan for your business with no hidden charges<br />
          because we believe in honesty and transparency.
        </p>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div className={`pc ${plan.is_featured ? 'pc-featured' : ''}`} key={plan.name} data-aos="fade-up">
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
                {(plan.features || []).map(f => (
                  <li key={f}><FiCheck className="pc-check" size={14} /> {f}</li>
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
