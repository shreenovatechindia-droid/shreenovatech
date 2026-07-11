import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import './About.css';

/* ── Data ── */
const stats = [
  { num: 5,      suffix: '+',   label: 'Years Experience',    icon: '🏆' },
  { num: 500,    suffix: '+',   label: 'Projects Delivered',  icon: '🚀' },
  { num: 10000,  suffix: '+',   label: 'Happy Customers',     icon: '😊' },
  { num: 99.9,   suffix: '%',   label: 'Uptime',              icon: '⚡' },
  { num: 24,     suffix: '×7',  label: 'Support',             icon: '🛡️' },
];

const checklist = [
  'Website Development', 'Mobile App Development', 'Web Hosting',
  'SEO Optimization', 'Digital Marketing', 'Custom Software',
  'Cloud Solutions', 'Dedicated Support',
];

const services = [
  { icon: '💻', title: 'Website Development',  desc: 'Business, eCommerce, landing pages & custom web apps built with modern tech.' },
  { icon: '☁️', title: 'Cloud Hosting',         desc: 'Scalable cloud infrastructure with 99.9% uptime and blazing-fast speeds.' },
  { icon: '🔍', title: 'SEO Services',          desc: 'On-page, off-page & technical SEO to dominate Google rankings.' },
  { icon: '📣', title: 'Digital Marketing',     desc: 'Social media, Google Ads, content & email marketing campaigns.' },
  { icon: '⚛️', title: 'React Development',     desc: 'High-performance React & Next.js applications for modern businesses.' },
  { icon: '📱', title: 'Mobile Apps',           desc: 'Cross-platform iOS & Android apps with seamless user experience.' },
  { icon: '🛒', title: 'E-Commerce',            desc: 'Full-featured online stores with payment gateway & inventory management.' },
  { icon: '🎨', title: 'UI/UX Design',          desc: 'Pixel-perfect designs that convert visitors into loyal customers.' },
  { icon: '⚙️', title: 'Custom Software',       desc: 'Tailored software solutions built around your unique business needs.' },
  { icon: '📊', title: 'CRM Development',       desc: 'Custom CRM systems to manage leads, clients & business workflows.' },
  { icon: '🔗', title: 'API Development',       desc: 'Robust REST & GraphQL APIs for seamless third-party integrations.' },
  { icon: '🔧', title: 'Maintenance',           desc: 'Ongoing support, updates & performance optimization for your digital assets.' },
];

const whyUs = [
  { icon: '👥', title: 'Experienced Team',         desc: '5+ years of expertise across web, mobile & digital marketing.' },
  { icon: '💰', title: 'Affordable Pricing',        desc: 'Premium quality at startup-friendly prices with no hidden charges.' },
  { icon: '⚡', title: 'Fast Delivery',             desc: 'On-time project delivery with agile development methodology.' },
  { icon: '🔍', title: 'Transparent Process',       desc: 'Regular updates, clear communication & full project visibility.' },
  { icon: '🛠️', title: 'Modern Technology',         desc: 'Latest tech stack — React, Node.js, AWS, and more.' },
  { icon: '🔒', title: 'Secure Development',        desc: 'Enterprise-grade security standards in every project we build.' },
  { icon: '🎁', title: '1 Year Free Support',       desc: 'Free maintenance & support for 1 full year after project delivery.' },
  { icon: '🛡️', title: '24×7 Technical Support',   desc: 'Round-the-clock support team always ready to help you.' },
  { icon: '✅', title: 'Premium Quality Assurance', desc: 'Rigorous QA testing before every deployment for zero-bug delivery.' },
];

const team = [
  { name: 'Amit Ranjan',    role: 'Founder & CEO',           emoji: '👨‍💼', color: '#16A34A' },
  { name: 'Dev Team',       role: 'Web & App Development',   emoji: '👨‍💻', color: '#2563EB' },
  { name: 'Design Team',    role: 'UI/UX & Branding',        emoji: '🎨', color: '#7C3AED' },
  { name: 'Marketing Team', role: 'Digital Marketing & SEO', emoji: '📈', color: '#EA580C' },
  { name: 'Support Team',   role: '24×7 Client Support',     emoji: '🎧', color: '#0891B2' },
];

const process = [
  { num: '01', title: 'Consultation', desc: 'Understanding your goals & requirements.' },
  { num: '02', title: 'Planning',     desc: 'Strategy, timeline & resource allocation.' },
  { num: '03', title: 'Design',       desc: 'Wireframes, UI/UX & brand alignment.' },
  { num: '04', title: 'Development',  desc: 'Clean code with modern tech stack.' },
  { num: '05', title: 'Testing',      desc: 'QA, performance & security testing.' },
  { num: '06', title: 'Deployment',   desc: 'Live launch with zero downtime.' },
  { num: '07', title: 'Support',      desc: '1 year free maintenance & support.' },
];

const floatingCards = [
  { icon: '🌐', label: 'Website',          color: '#16A34A' },
  { icon: '☁️', label: 'Hosting',          color: '#2563EB' },
  { icon: '🔍', label: 'SEO',              color: '#7C3AED' },
  { icon: '📱', label: 'Apps',             color: '#EA580C' },
  { icon: '📣', label: 'Digital Marketing',color: '#0891B2' },
];

/* ── Counter Hook ── */
function useCounter(target, started) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    const isDecimal = target % 1 !== 0;
    const duration = 2000, steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);
  return count;
}

function StatCard({ stat, started }) {
  const count = useCounter(stat.num, started);
  return (
    <div className="ab-stat-card" data-aos="fade-up">
      <div className="ab-stat-icon">{stat.icon}</div>
      <div className="ab-stat-num">{count}{stat.suffix}</div>
      <div className="ab-stat-label">{stat.label}</div>
    </div>
  );
}

const skills = ['React.js','React Native','PHP','JavaScript','HTML5','CSS3','Bootstrap','MySQL','Node.js','REST API','Git & GitHub','Cloud Hosting','SEO','Digital Marketing','AI / ML'];
const achievements = [
  { icon: '🚀', val: '500+',    label: 'Projects Delivered' },
  { icon: '😊', val: '10,000+', label: 'Happy Clients' },
  { icon: '⚡', val: '99.9%',   label: 'Hosting Uptime' },
  { icon: '🛡️', val: '24×7',   label: 'Client Support' },
];

function FounderModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div className="fm-overlay" onClick={onClose}>
      <div className="fm-modal" onClick={e => e.stopPropagation()}>
        <button className="fm-close" onClick={onClose}>✕</button>
        <div className="fm-inner">

          {/* LEFT */}
          <div className="fm-left">
            <img src="/amit.jpg" alt="Amit Ranjan" className="fm-photo" />
            <h3 className="fm-name">Amit Ranjan</h3>
            <p className="fm-designation">Founder & CEO</p>
            <p className="fm-company">ShreeNova Tech</p>
            <div className="fm-meta">
              <span>🏆 5+ Years Experience</span>
              <span>📍 Noida, Uttar Pradesh, India</span>
            </div>
            <div className="fm-socials">
              <a href="https://www.linkedin.com/in/amit-ranjan-65a876323/" target="_blank" rel="noreferrer" className="fm-social-btn" title="LinkedIn">in</a>
              <a href="https://github.com/AmitRanjan1401" target="_blank" rel="noreferrer" className="fm-social-btn" title="GitHub">GH</a>
              <a href="https://amit.xo.je/" target="_blank" rel="noreferrer" className="fm-social-btn" title="Portfolio">🌐</a>
              <a href="mailto:support@shreenovatech.in" className="fm-social-btn" title="Email">✉️</a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="fm-right">
            <div className="fm-section-tag">About the Founder</div>
            <p className="fm-desc">Amit Ranjan is the Founder & CEO of ShreeNova Tech, dedicated to helping businesses grow through innovative technology solutions.</p>
            <p className="fm-desc">He specializes in Full Stack Web Development, React.js, React Native, PHP, AI/ML, Cloud Hosting, SEO, Digital Marketing, CRM & ERP Development, and modern business automation.</p>
            <p className="fm-desc">His goal is to deliver high-quality, secure, scalable, and user-friendly digital solutions that help startups, SMEs, and enterprises build a strong online presence.</p>

            <div className="fm-block-label">Skills</div>
            <div className="fm-skills">
              {skills.map(s => <span key={s} className="fm-skill">{s}</span>)}
            </div>

            <div className="fm-block-label">Achievements</div>
            <div className="fm-achievements">
              {achievements.map(a => (
                <div key={a.label} className="fm-achievement">
                  <span className="fm-ach-icon">{a.icon}</span>
                  <span className="fm-ach-val">{a.val}</span>
                  <span className="fm-ach-label">{a.label}</span>
                </div>
              ))}
            </div>

            <div className="fm-btns">
              <Link to="/#portfolio" className="fm-btn-outline" onClick={onClose}>View Portfolio</Link>
              <Link to="/book-now" className="fm-btn-primary" onClick={onClose}>Book Consultation</Link>
              <a href="https://wa.me/918987050207" target="_blank" rel="noreferrer" className="fm-btn-wa">💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const statsRef = useRef();
  const [statsStarted, setStatsStarted] = useState(false);
  const [founderModal, setFounderModal] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsStarted(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <MainLayout>

      {/* ── SECTION 1: Hero ── */}
      <section className="ab-hero">
        <div className="ab-hero-bg-shapes">
          <div className="ab-shape ab-shape-1" />
          <div className="ab-shape ab-shape-2" />
          <div className="ab-shape ab-shape-3" />
        </div>
        <div className="container">
          <div className="ab-hero-inner">
            <div className="ab-hero-left" data-aos="fade-right">
              <div className="ab-breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <span>About Us</span>
              </div>
              <div className="ab-badge">✦ About ShreeNova Tech</div>
              <h1 className="ab-hero-title">
                Building Digital Experiences<br />
                That <span className="ab-gradient-text">Inspire Growth</span>
              </h1>
              <p className="ab-hero-sub">
                We help startups, businesses, educational institutions and enterprises transform ideas into powerful digital products through modern technology.
              </p>
              <div className="ab-hero-btns">
                <Link to="/book-now" className="ab-btn-primary">Get Free Consultation</Link>
                <Link to="/#portfolio" className="ab-btn-outline">View Portfolio</Link>
              </div>
            </div>
            <div className="ab-hero-right" data-aos="fade-left">
              <div className="ab-illustration">
                <div className="ab-illus-core">
                  <div className="ab-illus-logo">🚀</div>
                  <div className="ab-illus-ring ab-ring-1" />
                  <div className="ab-illus-ring ab-ring-2" />
                  <div className="ab-illus-ring ab-ring-3" />
                </div>
                {floatingCards.map((c, i) => (
                  <div key={c.label} className={`ab-float-card ab-float-${i + 1}`} style={{ '--fc': c.color }}>
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Stats ── */}
      <section className="ab-stats-section" ref={statsRef}>
        <div className="container">
          <div className="ab-stats-grid">
            {stats.map(s => <StatCard key={s.label} stat={s} started={statsStarted} />)}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Who We Are ── */}
      <section className="ab-section ab-section-white">
        <div className="container">
          <div className="ab-two-col">
            <div className="ab-img-wrap" data-aos="fade-right">
              <div className="ab-img-box">
                <div className="ab-img-inner">🏢</div>
                <div className="ab-img-badge ab-img-badge-1">🏆 5+ Years</div>
                <div className="ab-img-badge ab-img-badge-2">✅ 500+ Projects</div>
              </div>
            </div>
            <div className="ab-who-content" data-aos="fade-left">
              <div className="ab-section-tag">Who We Are</div>
              <h2 className="ab-section-title">Your Trusted <span>Digital Partner</span> in India</h2>
              <p className="ab-section-desc">Founded with a passion for technology, ShreeNova Tech has grown into a full-service digital agency trusted by thousands of clients across India. From startups to enterprises, we deliver tailored solutions combining creativity, technology, and strategy.</p>
              <ul className="ab-checklist">
                {checklist.map(item => (
                  <li key={item}>
                    <span className="ab-check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTIONS 4-6: Mission / Vision / Commitment ── */}
      <section className="ab-section ab-section-light">
        <div className="container">
          <div className="ab-section-head" data-aos="fade-up">
            <div className="ab-section-tag">Our Foundation</div>
            <h2 className="ab-section-title">Mission, Vision & <span>Commitment</span></h2>
            <p className="ab-section-sub">The principles that guide everything we do at ShreeNova Tech.</p>
          </div>
          <div className="ab-mvc-grid">
            {[
              { icon: '🎯', color: '#16A34A', title: 'Our Mission',    desc: 'To empower businesses with affordable, high-quality digital solutions that drive real growth and measurable online success for every client we serve.' },
              { icon: '🌟', color: '#2563EB', title: 'Our Vision',     desc: "To become India's most trusted digital partner for startups, SMEs, and enterprises — delivering world-class technology at accessible prices." },
              { icon: '🤝', color: '#7C3AED', title: 'Our Commitment', desc: 'We are committed to delivering on-time, transparent, and result-driven services with 24×7 dedicated support and zero compromise on quality.' },
            ].map((v, i) => (
              <div className="ab-mvc-card" key={v.title} data-aos="fade-up" data-aos-delay={i * 100} style={{ '--mvc-color': v.color }}>
                <div className="ab-mvc-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
                <div className="ab-mvc-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: Services ── */}
      <section className="ab-section ab-section-white">
        <div className="container">
          <div className="ab-section-head" data-aos="fade-up">
            <div className="ab-section-tag">What We Offer</div>
            <h2 className="ab-section-title">Our <span>Premium Services</span></h2>
            <p className="ab-section-sub">End-to-end digital solutions to accelerate your business growth.</p>
          </div>
          <div className="ab-services-grid">
            {services.map((s, i) => (
              <div className="ab-service-card" key={s.title} data-aos="fade-up" data-aos-delay={(i % 4) * 60}>
                <div className="ab-service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="ab-service-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: Why Choose Us ── */}
      <section className="ab-section ab-section-light">
        <div className="container">
          <div className="ab-section-head" data-aos="fade-up">
            <div className="ab-section-tag">Why ShreeNova Tech</div>
            <h2 className="ab-section-title">Why Businesses <span>Choose Us</span></h2>
            <p className="ab-section-sub">9 compelling reasons why 10,000+ clients trust us with their digital growth.</p>
          </div>
          <div className="ab-why-grid">
            {whyUs.map((w, i) => (
              <div className="ab-why-card" key={w.title} data-aos="fade-up" data-aos-delay={(i % 3) * 80}>
                <div className="ab-why-num">0{i + 1}</div>
                <div className="ab-why-icon">{w.icon}</div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 9: Team ── */}
      <section className="ab-section ab-section-white">
        <div className="container">
          <div className="ab-section-head" data-aos="fade-up">
            <div className="ab-section-tag">Our People</div>
            <h2 className="ab-section-title">Meet Our <span>Expert Team</span></h2>
            <p className="ab-section-sub">Passionate professionals dedicated to your digital success.</p>
          </div>
          <div className="ab-team-grid">
            {team.map((t, i) => (
              <div
                className={`ab-team-card${t.name === 'Amit Ranjan' ? ' ab-team-card-clickable' : ''}`}
                key={t.name}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                style={{ '--tc': t.color }}
                onClick={t.name === 'Amit Ranjan' ? () => setFounderModal(true) : undefined}
              >
                {t.name === 'Amit Ranjan'
                  ? <img src="/amit.jpg" alt="Amit Ranjan" className="ab-team-photo" />
                  : <div className="ab-team-avatar">{t.emoji}</div>
                }
                <h4>{t.name}</h4>
                <p>{t.role}</p>
                {t.name === 'Amit Ranjan' && <span className="ab-team-view">View Profile →</span>}
                <div className="ab-team-line" />
              </div>
            ))}
          </div>
          {founderModal && <FounderModal onClose={() => setFounderModal(false)} />}
        </div>
      </section>

      {/* ── SECTION 10: Process ── */}
      <section className="ab-section ab-section-light">
        <div className="container">
          <div className="ab-section-head" data-aos="fade-up">
            <div className="ab-section-tag">How We Work</div>
            <h2 className="ab-section-title">Our <span>Work Process</span></h2>
            <p className="ab-section-sub">A proven 7-step process that ensures perfect delivery every time.</p>
          </div>
          <div className="ab-process-wrap">
            {process.map((p, i) => (
              <div className="ab-process-item" key={p.num} data-aos="fade-up" data-aos-delay={i * 70}>
                <div className="ab-process-card">
                  <div className="ab-process-num">{p.num}</div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
                {i < process.length - 1 && <div className="ab-process-arrow">↓</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 11: Trust ── */}
      <section className="ab-section ab-section-white">
        <div className="container">
          <div className="ab-trust-wrap" data-aos="fade-up">
            <div className="ab-trust-card">
              <div className="ab-trust-stars">★★★★★</div>
              <div className="ab-trust-rating">4.9<span>/5</span></div>
              <div className="ab-trust-label">Google Rating</div>
            </div>
            <div className="ab-trust-divider" />
            <div className="ab-trust-card">
              <div className="ab-trust-big">10,000+</div>
              <div className="ab-trust-label">Happy Clients</div>
            </div>
            <div className="ab-trust-divider" />
            <div className="ab-trust-card">
              <div className="ab-trust-big">🇮🇳</div>
              <div className="ab-trust-label">Trusted Across India</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 12: CTA ── */}
      <section className="ab-cta-section">
        <div className="ab-cta-shapes">
          <div className="ab-cta-shape ab-cta-shape-1" />
          <div className="ab-cta-shape ab-cta-shape-2" />
        </div>
        <div className="container">
          <div className="ab-cta-inner" data-aos="fade-up">
            <div className="ab-badge ab-badge-white">✦ Let's Work Together</div>
            <h2>Ready to Grow Your Business?</h2>
            <p>Let's Build Something Amazing Together.</p>
            <div className="ab-cta-btns">
              <Link to="/book-now" className="ab-btn-white">Book Free Consultation</Link>
              <Link to="/#contact" className="ab-btn-outline-white">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

    </MainLayout>
  );
}
