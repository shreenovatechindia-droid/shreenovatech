import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import ServiceLayout, { ServiceHero, FAQ, CTABanner, Reviews } from '../components/ServiceLayout';

const features = [
  { icon:'⚡', title:'99.9% Uptime Guarantee', desc:'Your website stays online 24/7 with our enterprise-grade server infrastructure and redundant network.' },
  { icon:'🔒', title:'Free SSL Certificate', desc:'Every hosting plan includes a free SSL certificate to secure your website and boost Google rankings.' },
  { icon:'💾', title:'Daily Automatic Backup', desc:'Your data is automatically backed up every day so you never lose important website content.' },
  { icon:'🚀', title:'Fast SSD Storage', desc:'NVMe SSD storage delivers 10x faster website loading speeds compared to traditional HDD hosting.' },
  { icon:'🖥️', title:'cPanel Access', desc:'Easy-to-use cPanel control panel to manage your website, emails, databases and files effortlessly.' },
  { icon:'📦', title:'One Click Installer', desc:'Install WordPress, Joomla, Magento and 400+ apps with a single click using Softaculous.' },
  { icon:'🔄', title:'Free Website Migration', desc:'We migrate your existing website to our servers for free with zero downtime guaranteed.' },
  { icon:'📧', title:'Business Email Hosting', desc:'Professional business email accounts like info@yourbusiness.com included with every plan.' },
  { icon:'🌐', title:'Free Domain Registration', desc:'Get a free .com or .in domain name for the first year with any annual hosting plan.' },
];

const plans = [
  { name:'Starter', price:'₹99', per:'/month', desc:'Perfect for personal websites and blogs.', features:['1 Website','5 GB SSD Storage','Free SSL','2 Email Accounts','99.9% Uptime','Basic Support'], featured:false },
  { name:'Business', price:'₹199', per:'/month', desc:'Ideal for small business websites.', features:['5 Websites','20 GB SSD Storage','Free SSL','10 Email Accounts','Free Domain','Priority Support','Daily Backup'], featured:true },
  { name:'Enterprise', price:'₹399', per:'/month', desc:'For high traffic and multiple websites.', features:['Unlimited Websites','50 GB SSD Storage','Free SSL','Unlimited Emails','Free Domain','24/7 Support','Daily Backup','Free Migration'], featured:false },
];

const faqs = [
  { q:'What is web hosting?', a:'Web hosting is a service that stores your website files on a server and makes them accessible on the internet 24/7. Without hosting, your website cannot be accessed online.' },
  { q:'Do you provide free domain with hosting?', a:'Yes! All our annual hosting plans include a free .com or .in domain registration for the first year.' },
  { q:'Can I upgrade my hosting plan later?', a:'Absolutely. You can upgrade your hosting plan at any time from your control panel without any downtime.' },
  { q:'What is the server location?', a:'Our servers are located in India (Mumbai) for the fastest loading speeds for Indian visitors.' },
  { q:'Do you offer a money-back guarantee?', a:'Yes, we offer a 30-day money-back guarantee on all hosting plans if you are not satisfied.' },
];

export default function HostingPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <ServiceLayout>
      <ServiceHero
        badge="Web Hosting Services"
        title="Reliable & Fast"
        highlight="Web Hosting"
        desc="Power your website with India's most reliable web hosting. 99.9% uptime, free SSL, daily backups and 24/7 expert support — everything your business needs to stay online."
        breadcrumb={[{ label:'Hosting' }]}
        stats={[{ value:'99.9%', label:'Uptime Guarantee' },{ value:'10,000+', label:'Websites Hosted' },{ value:'24/7', label:'Expert Support' },{ value:'30 Days', label:'Money Back' }]}
      />

      {/* Features */}
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head">
            <h2>Everything You Need for <span>Reliable Hosting</span></h2>
            <p>Our hosting plans come packed with powerful features to keep your website fast, secure and always online.</p>
          </div>
          <div className="sp-cards sp-cards-4" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
            {features.map(f => (
              <div className="sp-card" key={f.title}>
                <div className="sp-card-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hosting types */}
      <section className="sp-section sp-section-light">
        <div className="container">
          <div className="sp-section-head">
            <h2>Choose Your <span>Hosting Type</span></h2>
            <p>We offer multiple hosting solutions to match every website requirement and budget.</p>
          </div>
          <div className="sp-cards">
            {[
              { icon:'🌐', title:'Shared Hosting', desc:'Perfect for beginners and small business websites. Affordable, reliable and easy to manage.', link:'/shared-hosting' },
              { icon:'☁️', title:'Cloud Hosting', desc:'High performance cloud infrastructure with scalable resources for growing businesses.', link:'/cloud-hosting' },
              { icon:'🖥️', title:'VPS Hosting', desc:'Dedicated virtual private server with root access for high traffic and resource-intensive websites.', link:'/vps-hosting' },
              { icon:'📝', title:'WordPress Hosting', desc:'Optimized hosting specially built for WordPress websites with auto-updates and security.', link:'/wordpress-hosting' },
            ].map(h => (
              <div className="sp-card" key={h.title}>
                <div className="sp-card-icon">{h.icon}</div>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
                <Link to={h.link} style={{ color:'#16A34A', fontWeight:600, fontSize:13, marginTop:12, display:'inline-flex', alignItems:'center', gap:5, textDecoration:'none' }}>
                  Learn More <FiArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head">
            <h2>Simple & Transparent <span>Pricing</span></h2>
            <p>No hidden charges. Choose the plan that fits your needs and budget.</p>
          </div>
          <div className="sp-pricing-grid">
            {plans.map(p => (
              <div className={`sp-price-card${p.featured?' featured':''}`} key={p.name}>
                {p.featured && <div className="sp-price-ribbon">⭐ Most Popular</div>}
                <div className="sp-price-name">{p.name}</div>
                <div className="sp-price-desc">{p.desc}</div>
                <div className="sp-price-amt">{p.price}<span>{p.per}</span></div>
                <ul className="sp-checklist" style={{ marginBottom:24 }}>
                  {p.features.map(f => <li key={f}><span className="sp-check">✓</span>{f}</li>)}
                </ul>
                <Link to="/book-now" className={p.featured ? 'btn-green' : 'btn-outline-green'} style={{ width:'100%', justifyContent:'center' }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Reviews />

      {/* FAQ */}
      <section className="sp-section sp-section-light">
        <div className="container" style={{ maxWidth:760 }}>
          <div className="sp-section-head">
            <h2>Frequently Asked <span>Questions</span></h2>
          </div>
          <FAQ items={faqs} />
        </div>
      </section>

      <CTABanner title="Ready to Host Your Website?" subtitle="Get started today with our reliable hosting plans. Free domain, free SSL and 24/7 support included." />
    </ServiceLayout>
  );
}
