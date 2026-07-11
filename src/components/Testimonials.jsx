import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import { getTestimonials } from '../utils/api';
import '../css/sections.css';

const FALLBACK = [
  { name:'Ravi Sharma', role:'Business Owner', initials:'RS', rating:5, quote:'"ShreeNova Tech delivered exactly what they promised. My website looks perfect on all devices. Highly professional and on time."' },
  { name:'Priya Singh', role:'Entrepreneur', initials:'PS', rating:5, quote:'"Great support and amazing designs. My website looks perfect on all devices. I am very happy with the results."' },
  { name:'Amit Verma', role:'CEO, Startup', initials:'AV', rating:5, quote:'"Affordable pricing with premium quality. Best decision for my business. The team is very responsive and professional."' },
];

export default function Testimonials() {
  const [list, setList]     = useState(FALLBACK);
  const [active, setActive] = useState(0);

  useEffect(() => {
    getTestimonials()
      .then(r => { if (r.data?.data?.length) setList(r.data.data); })
      .catch(() => {});
  }, []);

  return (
    <section className="testimonial-section">
      <div className="container">
        <h2 className="section-title">
          What Our <span className="text-green">Clients</span> Say
        </h2>
        <p className="section-subtitle">
          Real feedback from real clients who trusted ShreeNova Tech for their digital journey.
        </p>
        <div className="row g-4">
          {list.map((t, i) => (
            <div className="col-lg-4 col-md-6" key={t.name || i} data-aos="fade-up" data-aos-delay={i * 100}>
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  {Array(t.rating || 5).fill(0).map((_, j) => <FiStar key={j} fill="#f5a623" stroke="#f5a623" />)}
                </div>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initials}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-center gap-2 mt-4">
          {list.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: active === i ? 28 : 10, height: 10,
                borderRadius: 5, border: 'none',
                background: active === i ? 'var(--green)' : '#ddd',
                transition: 'all 0.3s', cursor: 'pointer', padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
