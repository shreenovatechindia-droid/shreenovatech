import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceLayout, { ServiceHero, FAQ, CTABanner, Reviews } from '../components/ServiceLayout';

/* ── Shared Hosting ── */
export function SharedHostingPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const faqs = [
    { q:'What is shared hosting?', a:'Shared hosting means your website shares server resources with other websites. It is the most affordable hosting option, perfect for small websites and beginners.' },
    { q:'Is shared hosting secure?', a:'Yes. Our shared hosting includes free SSL, malware scanning and firewall protection to keep your website safe.' },
    { q:'Can I host multiple websites?', a:'Our Business and Enterprise shared hosting plans allow you to host multiple websites under one account.' },
    { q:'What is the bandwidth limit?', a:'Our plans come with unmetered bandwidth so your website can handle traffic spikes without extra charges.' },
  ];
  return (
    <ServiceLayout>
      <ServiceHero badge="Shared Hosting" title="Affordable & Reliable" highlight="Shared Hosting" desc="Perfect for beginners and small business websites. Get your website online today with our affordable shared hosting plans starting at just ₹99/month." breadcrumb={[{ label:'Hosting', path:'/hosting' },{ label:'Shared Hosting' }]} stats={[{ value:'₹99', label:'Starting Price' },{ value:'99.9%', label:'Uptime' },{ value:'Free', label:'SSL Certificate' },{ value:'24/7', label:'Support' }]} />
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Why Choose <span>Shared Hosting?</span></h2><p>Shared hosting is the most cost-effective way to get your website online with all essential features included.</p></div>
          <div className="sp-cards">
            {[{ icon:'💰', title:'Most Affordable', desc:'Start your website for as low as ₹99/month with all essential features included.' },{ icon:'🚀', title:'Easy Setup', desc:'Get your website live in minutes with our one-click installer and cPanel control panel.' },{ icon:'🔒', title:'Free SSL Security', desc:'Every plan includes a free SSL certificate to secure your website and customer data.' },{ icon:'📧', title:'Business Emails', desc:'Create professional email accounts like info@yourbusiness.com with every plan.' },{ icon:'💾', title:'Daily Backups', desc:'Automatic daily backups ensure your website data is always safe and recoverable.' },{ icon:'🌐', title:'Free Domain', desc:'Get a free .com or .in domain name for the first year with annual plans.' }].map(f => <div className="sp-card" key={f.title}><div className="sp-card-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
          </div>
        </div>
      </section>
      <section className="sp-section sp-section-light"><div className="container" style={{ maxWidth:760 }}><div className="sp-section-head"><h2>Frequently Asked <span>Questions</span></h2></div><FAQ items={faqs} /></div></section>
      <CTABanner title="Start Your Website Today!" subtitle="Get shared hosting with free domain, free SSL and 24/7 support. No hidden charges." />
    </ServiceLayout>
  );
}

/* ── Cloud Hosting ── */
export function CloudHostingPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const faqs = [
    { q:'What is cloud hosting?', a:'Cloud hosting uses multiple servers to host your website, providing better performance, reliability and scalability compared to traditional hosting.' },
    { q:'Is cloud hosting faster than shared hosting?', a:'Yes. Cloud hosting provides dedicated resources and SSD storage, making it significantly faster than shared hosting.' },
    { q:'Can I scale resources instantly?', a:'Yes. You can increase CPU, RAM and storage instantly from your control panel without any downtime.' },
    { q:'Is cloud hosting secure?', a:'Cloud hosting includes advanced firewall, DDoS protection, SSL and daily backups for maximum security.' },
  ];
  return (
    <ServiceLayout>
      <ServiceHero badge="Cloud Hosting" title="High Performance" highlight="Cloud Hosting" desc="Scale your business with our enterprise-grade cloud hosting infrastructure. Dedicated resources, instant scalability and 99.99% uptime for mission-critical websites." breadcrumb={[{ label:'Hosting', path:'/hosting' },{ label:'Cloud Hosting' }]} stats={[{ value:'99.99%', label:'Uptime SLA' },{ value:'10x', label:'Faster Speed' },{ value:'Instant', label:'Scalability' },{ value:'24/7', label:'Monitoring' }]} />
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Cloud Hosting <span>Benefits</span></h2><p>Experience the power of cloud infrastructure with dedicated resources and enterprise-grade performance.</p></div>
          <div className="sp-cards">
            {[{ icon:'⚡', title:'Blazing Fast Speed', desc:'NVMe SSD storage and dedicated CPU resources deliver lightning-fast website loading speeds.' },{ icon:'📈', title:'Instant Scalability', desc:'Scale CPU, RAM and storage up or down instantly based on your traffic requirements.' },{ icon:'🛡️', title:'Advanced Security', desc:'Enterprise firewall, DDoS protection, malware scanning and free SSL certificate included.' },{ icon:'🔄', title:'Auto Failover', desc:'If one server fails, your website automatically switches to another server with zero downtime.' },{ icon:'📊', title:'Real-time Monitoring', desc:'24/7 server monitoring with instant alerts and automatic issue resolution.' },{ icon:'💾', title:'Automated Backups', desc:'Daily automated backups with one-click restore to protect your business data.' }].map(f => <div className="sp-card" key={f.title}><div className="sp-card-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
          </div>
        </div>
      </section>
      <section className="sp-section sp-section-light"><div className="container" style={{ maxWidth:760 }}><div className="sp-section-head"><h2>Frequently Asked <span>Questions</span></h2></div><FAQ items={faqs} /></div></section>
      <CTABanner title="Power Your Business with Cloud Hosting" subtitle="Get enterprise-grade cloud hosting with dedicated resources and 99.99% uptime guarantee." />
    </ServiceLayout>
  );
}

/* ── VPS Hosting ── */
export function VPSHostingPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const faqs = [
    { q:'What is VPS hosting?', a:'VPS (Virtual Private Server) hosting gives you a dedicated portion of a physical server with guaranteed resources, root access and complete control over your environment.' },
    { q:'Do I get root access with VPS?', a:'Yes. All our VPS plans include full root access so you can install any software and configure the server as needed.' },
    { q:'What operating systems are available?', a:'We offer CentOS, Ubuntu, Debian and Windows Server options for your VPS.' },
    { q:'Is VPS hosting suitable for e-commerce?', a:'Absolutely. VPS hosting is ideal for e-commerce websites that need dedicated resources, security and high performance.' },
  ];
  return (
    <ServiceLayout>
      <ServiceHero badge="VPS Hosting" title="Dedicated Power with" highlight="VPS Hosting" desc="Get the power of a dedicated server at a fraction of the cost. Full root access, guaranteed resources and complete control over your hosting environment." breadcrumb={[{ label:'Hosting', path:'/hosting' },{ label:'VPS Hosting' }]} stats={[{ value:'Root', label:'Full Access' },{ value:'100%', label:'Dedicated Resources' },{ value:'1 Gbps', label:'Network Speed' },{ value:'24/7', label:'Expert Support' }]} />
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>VPS Hosting <span>Features</span></h2><p>Everything you need for a powerful, secure and fully managed virtual private server.</p></div>
          <div className="sp-cards">
            {[{ icon:'🔑', title:'Full Root Access', desc:'Complete control over your server environment. Install any software, configure settings and manage everything.' },{ icon:'⚡', title:'Dedicated Resources', desc:'Guaranteed CPU, RAM and SSD storage that is never shared with other users.' },{ icon:'🛡️', title:'Advanced Security', desc:'Dedicated firewall, DDoS protection, intrusion detection and free SSL certificate.' },{ icon:'📈', title:'High Performance', desc:'NVMe SSD storage and high-speed network for maximum website performance.' },{ icon:'🔄', title:'Easy Scalability', desc:'Upgrade your VPS resources instantly as your business grows without migration.' },{ icon:'🖥️', title:'Full Management', desc:'Optional fully managed VPS service where our team handles all server administration.' }].map(f => <div className="sp-card" key={f.title}><div className="sp-card-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
          </div>
        </div>
      </section>
      <section className="sp-section sp-section-light"><div className="container" style={{ maxWidth:760 }}><div className="sp-section-head"><h2>Frequently Asked <span>Questions</span></h2></div><FAQ items={faqs} /></div></section>
      <CTABanner title="Get Your VPS Server Today" subtitle="Full root access, dedicated resources and 24/7 expert support. Perfect for high-traffic websites." />
    </ServiceLayout>
  );
}

/* ── WordPress Hosting ── */
export function WordPressHostingPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const faqs = [
    { q:'What makes WordPress hosting different?', a:'WordPress hosting is specifically optimized for WordPress with pre-installed WordPress, automatic updates, caching and security features designed for WordPress websites.' },
    { q:'Is WordPress hosting faster?', a:'Yes. Our WordPress hosting uses server-level caching, CDN and optimized PHP configurations that make WordPress websites load 3x faster.' },
    { q:'Do you provide WordPress support?', a:'Yes. Our WordPress experts are available 24/7 to help with any WordPress issues, plugin conflicts or customization needs.' },
    { q:'Can I migrate my existing WordPress site?', a:'Yes. We provide free WordPress migration service with zero downtime and complete data transfer.' },
  ];
  return (
    <ServiceLayout>
      <ServiceHero badge="WordPress Hosting" title="Optimized" highlight="WordPress Hosting" desc="Hosting built specifically for WordPress. Pre-installed WordPress, automatic updates, enhanced security and blazing-fast performance out of the box." breadcrumb={[{ label:'Hosting', path:'/hosting' },{ label:'WordPress Hosting' }]} stats={[{ value:'3x', label:'Faster WordPress' },{ value:'Auto', label:'WordPress Updates' },{ value:'Free', label:'Migration' },{ value:'24/7', label:'WP Support' }]} />
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Why Our WordPress Hosting <span>Stands Out</span></h2><p>Every feature is designed to make your WordPress website faster, safer and easier to manage.</p></div>
          <div className="sp-cards">
            {[{ icon:'📝', title:'Pre-installed WordPress', desc:'WordPress comes pre-installed and ready to use. Start building your website immediately.' },{ icon:'🔄', title:'Auto Updates', desc:'WordPress core, themes and plugins are automatically updated to keep your site secure.' },{ icon:'⚡', title:'WordPress Caching', desc:'Built-in server-level caching makes your WordPress website load 3x faster.' },{ icon:'🛡️', title:'WordPress Security', desc:'Specialized WordPress firewall, malware scanning and brute force protection.' },{ icon:'🌐', title:'Free CDN', desc:'Content Delivery Network ensures fast loading for visitors from anywhere in India.' },{ icon:'📊', title:'WordPress Staging', desc:'Test changes on a staging environment before pushing them live to your website.' }].map(f => <div className="sp-card" key={f.title}><div className="sp-card-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
          </div>
        </div>
      </section>
      <section className="sp-section sp-section-light"><div className="container" style={{ maxWidth:760 }}><div className="sp-section-head"><h2>Frequently Asked <span>Questions</span></h2></div><FAQ items={faqs} /></div></section>
      <CTABanner title="Launch Your WordPress Website Today" subtitle="Optimized WordPress hosting with free migration, auto-updates and 24/7 WordPress expert support." />
    </ServiceLayout>
  );
}
