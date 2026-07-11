import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import ServiceLayout, { ServiceHero, FAQ, CTABanner, Reviews } from '../components/ServiceLayout';

const process = [
  { n:1, title:'Discovery', desc:'We understand your business goals, target audience and project requirements.' },
  { n:2, title:'Design', desc:'Our designers create a modern, responsive UI/UX design for your approval.' },
  { n:3, title:'Development', desc:'Our developers build your website with clean, fast and SEO-friendly code.' },
  { n:4, title:'Testing', desc:'We thoroughly test your website on all devices and browsers before launch.' },
  { n:5, title:'Launch', desc:'Your website goes live with full support and post-launch assistance.' },
];

const tech = ['React.js','HTML5','CSS3','JavaScript','Bootstrap','Node.js','PHP','MySQL','WordPress','MongoDB','Tailwind CSS','Next.js'];

const faqs = [
  { q:'How long does it take to build a website?', a:'A standard business website takes 5–10 working days. E-commerce websites take 10–15 days. Custom web applications may take 30–60 days depending on complexity.' },
  { q:'Do you provide website maintenance after launch?', a:'Yes. All our packages include 1 year of free maintenance. After that, we offer affordable annual maintenance plans.' },
  { q:'Will my website be mobile-friendly?', a:'Absolutely. Every website we build is fully responsive and works perfectly on mobile, tablet and desktop devices.' },
  { q:'Do you provide SEO-friendly websites?', a:'Yes. We build all websites with proper SEO structure including meta tags, fast loading speed, clean code and mobile optimization.' },
  { q:'What is the payment process?', a:'We require 50% advance payment to start the project. The remaining 50% is due before the website goes live.' },
];

/* ── Main Website Development Page ── */
export default function WebDevPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <ServiceLayout>
      <ServiceHero badge="Website Development" title="Professional" highlight="Website Development" desc="We build modern, fast and SEO-friendly websites that help your business grow online. From simple business websites to complex e-commerce platforms — we deliver excellence." breadcrumb={[{ label:'Website Development' }]} stats={[{ value:'500+', label:'Websites Built' },{ value:'5 Days', label:'Avg Delivery' },{ value:'100%', label:'Client Satisfaction' },{ value:'1 Year', label:'Free Support' }]} />

      {/* Services */}
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Our Website Development <span>Services</span></h2><p>We offer a complete range of website development services for every business type and budget.</p></div>
          <div className="sp-cards">
            {[
              { icon:'🏢', title:'Business Website', desc:'Professional business websites that build trust, generate leads and represent your brand online.', link:'/business-website' },
              { icon:'🛒', title:'E-Commerce Website', desc:'Complete online stores with secure payment gateway, product management and admin panel.', link:'/ecommerce-website' },
              { icon:'📄', title:'Landing Page', desc:'High-converting landing pages designed for marketing campaigns and lead generation.', link:'/landing-page' },
              { icon:'⚙️', title:'Custom Development', desc:'Completely customized web applications and business software built to your exact requirements.', link:'/custom-development' },
              { icon:'📝', title:'CMS Development', desc:'Content management systems that let you update your website content without technical knowledge.' },
              { icon:'🎨', title:'UI/UX Design', desc:'Modern, user-friendly interface designs that provide an excellent user experience.' },
            ].map(s => (
              <div className="sp-card" key={s.title}>
                <div className="sp-card-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {s.link && <Link to={s.link} style={{ color:'#16A34A', fontWeight:600, fontSize:13, marginTop:12, display:'inline-flex', alignItems:'center', gap:5, textDecoration:'none' }}>Learn More <FiArrowRight size={13} /></Link>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="sp-section sp-section-light">
        <div className="container">
          <div className="sp-section-head"><h2>Why Choose <span>ShreeNova Tech?</span></h2><p>We combine technical expertise with creative design to deliver websites that truly work for your business.</p></div>
          <div className="sp-two-col">
            <div className="sp-two-col-img">🌐</div>
            <div>
              <h2>Building Websites That <span>Drive Results</span></h2>
              <p>At ShreeNova Tech, we don't just build websites — we build digital experiences that convert visitors into customers. Every website we create is designed with your business goals in mind.</p>
              <ul className="sp-checklist">
                {['SEO-friendly code structure','Mobile-first responsive design','Fast loading speed (under 3 seconds)','Secure HTTPS with free SSL','Modern UI with premium design','Easy content management system','Google Analytics integration','Social media integration'].map(i => <li key={i}><span className="sp-check">✓</span>{i}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Our Development <span>Process</span></h2><p>A proven 5-step process that ensures your website is delivered on time and exceeds expectations.</p></div>
          <div className="sp-process">
            {process.map(p => <div className="sp-process-step" key={p.n}><div className="sp-process-num">{p.n}</div><h4>{p.title}</h4><p>{p.desc}</p></div>)}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="sp-section sp-section-light">
        <div className="container">
          <div className="sp-section-head"><h2>Technologies We <span>Use</span></h2><p>We use the latest and most reliable technologies to build fast, secure and scalable websites.</p></div>
          <div className="sp-tech-grid">{tech.map(t => <span className="sp-tech-tag" key={t}>{t}</span>)}</div>
        </div>
      </section>

      <Reviews />

      <section className="sp-section sp-section-light"><div className="container" style={{ maxWidth:760 }}><div className="sp-section-head"><h2>Frequently Asked <span>Questions</span></h2></div><FAQ items={faqs} /></div></section>
      <CTABanner title="Ready to Build Your Website?" subtitle="Get a professional website starting at just ₹9,999. Free domain, free hosting and 1 year support included." />
    </ServiceLayout>
  );
}

/* ── Business Website ── */
export function BusinessWebsitePage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <ServiceLayout>
      <ServiceHero badge="Business Website" title="Professional" highlight="Business Website" desc="Build a powerful online presence with a professional business website that generates leads, builds trust and grows your brand 24/7." breadcrumb={[{ label:'Website Development', path:'/website-development' },{ label:'Business Website' }]} stats={[{ value:'₹9,999', label:'Starting Price' },{ value:'5 Days', label:'Delivery' },{ value:'100%', label:'Responsive' },{ value:'1 Year', label:'Free Support' }]} />
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>What's Included in Your <span>Business Website</span></h2><p>Every business website we build comes with everything you need to succeed online.</p></div>
          <div className="sp-cards">
            {[{ icon:'🎨', title:'Premium Design', desc:'Modern, professional design that reflects your brand identity and impresses visitors.' },{ icon:'📱', title:'Mobile Responsive', desc:'Perfectly optimized for all devices — mobile, tablet and desktop.' },{ icon:'🔍', title:'SEO Optimized', desc:'Built with proper SEO structure to rank higher on Google search results.' },{ icon:'⚡', title:'Fast Loading', desc:'Optimized code and images for lightning-fast page loading speeds.' },{ icon:'📞', title:'Lead Generation', desc:'Contact forms, WhatsApp button and call-to-action elements to capture leads.' },{ icon:'🔒', title:'Secure & Safe', desc:'Free SSL certificate and security best practices to protect your website.' }].map(f => <div className="sp-card" key={f.title}><div className="sp-card-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
          </div>
        </div>
      </section>
      <CTABanner title="Get Your Business Website Today" subtitle="Professional business website starting at ₹9,999 with free domain, hosting and 1 year support." />
    </ServiceLayout>
  );
}

/* ── E-Commerce Website ── */
export function EcommercePage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <ServiceLayout>
      <ServiceHero badge="E-Commerce Website" title="Complete" highlight="E-Commerce Solution" desc="Launch your online store with a fully-featured e-commerce website. Secure payments, product management, order tracking and everything you need to sell online." breadcrumb={[{ label:'Website Development', path:'/website-development' },{ label:'E-Commerce Website' }]} stats={[{ value:'₹14,999', label:'Starting Price' },{ value:'10 Days', label:'Delivery' },{ value:'Secure', label:'Payment Gateway' },{ value:'Admin', label:'Panel Included' }]} />
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Complete E-Commerce <span>Features</span></h2><p>Everything you need to run a successful online store from day one.</p></div>
          <div className="sp-cards">
            {[{ icon:'🛒', title:'Shopping Cart', desc:'Smooth add-to-cart experience with quantity management and wishlist functionality.' },{ icon:'💳', title:'Secure Payment Gateway', desc:'Integrated with Razorpay, PayU and other popular Indian payment gateways.' },{ icon:'📦', title:'Product Management', desc:'Easy admin panel to add, edit and manage unlimited products with images and variants.' },{ icon:'📊', title:'Order Management', desc:'Complete order tracking, invoice generation and customer notification system.' },{ icon:'🔍', title:'Product Search & Filter', desc:'Advanced search and filter options to help customers find products quickly.' },{ icon:'📱', title:'Mobile Commerce', desc:'Fully optimized mobile shopping experience for maximum conversions.' }].map(f => <div className="sp-card" key={f.title}><div className="sp-card-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
          </div>
        </div>
      </section>
      <CTABanner title="Launch Your Online Store Today" subtitle="Complete e-commerce website with payment gateway, admin panel and mobile optimization." />
    </ServiceLayout>
  );
}

/* ── Landing Page ── */
export function LandingPageService() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <ServiceLayout>
      <ServiceHero badge="Landing Page" title="High-Converting" highlight="Landing Pages" desc="Professionally designed landing pages that turn visitors into leads and customers. Optimized for conversions with compelling copy and strategic design." breadcrumb={[{ label:'Website Development', path:'/website-development' },{ label:'Landing Page' }]} stats={[{ value:'₹4,999', label:'Starting Price' },{ value:'3 Days', label:'Delivery' },{ value:'High', label:'Conversion Rate' },{ value:'A/B', label:'Testing Ready' }]} />
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Landing Page <span>Features</span></h2><p>Every landing page is designed with one goal — to convert your visitors into paying customers.</p></div>
          <div className="sp-cards">
            {[{ icon:'🎯', title:'Conversion Focused', desc:'Every element is strategically placed to guide visitors towards taking action.' },{ icon:'⚡', title:'Fast Loading', desc:'Optimized for speed to reduce bounce rate and improve Google Ads quality score.' },{ icon:'📱', title:'Mobile Optimized', desc:'Perfect display on all devices for maximum reach and conversions.' },{ icon:'📊', title:'Analytics Ready', desc:'Google Analytics and Facebook Pixel integration for tracking conversions.' },{ icon:'🔗', title:'Lead Capture Forms', desc:'Strategic form placement with compelling CTAs to maximize lead generation.' },{ icon:'🎨', title:'Premium Design', desc:'Eye-catching design that builds trust and encourages visitors to take action.' }].map(f => <div className="sp-card" key={f.title}><div className="sp-card-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
          </div>
        </div>
      </section>
      <CTABanner title="Get a High-Converting Landing Page" subtitle="Professional landing pages that generate leads and grow your business starting at ₹4,999." />
    </ServiceLayout>
  );
}

/* ── Custom Development ── */
export function CustomDevPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <ServiceLayout>
      <ServiceHero badge="Custom Development" title="Tailored" highlight="Custom Web Solutions" desc="Completely customized web applications, business software and digital platforms built exactly to your specifications. No templates — pure custom development." breadcrumb={[{ label:'Website Development', path:'/website-development' },{ label:'Custom Development' }]} stats={[{ value:'100%', label:'Custom Built' },{ value:'Scalable', label:'Architecture' },{ value:'Secure', label:'Code Standards' },{ value:'Full', label:'Source Code' }]} />
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Custom Development <span>Capabilities</span></h2><p>We build any type of web application or business software you can imagine.</p></div>
          <div className="sp-cards">
            {[{ icon:'🏗️', title:'Web Applications', desc:'Complex web applications with user authentication, dashboards and real-time features.' },{ icon:'🔧', title:'CRM Systems', desc:'Custom customer relationship management systems tailored to your business workflow.' },{ icon:'📊', title:'ERP Solutions', desc:'Enterprise resource planning software to manage your entire business operations.' },{ icon:'🛒', title:'Custom E-Commerce', desc:'Fully custom online stores with unique features beyond standard e-commerce platforms.' },{ icon:'🔗', title:'API Development', desc:'RESTful APIs and third-party integrations to connect your systems seamlessly.' },{ icon:'📱', title:'Progressive Web Apps', desc:'App-like web experiences that work offline and can be installed on mobile devices.' }].map(f => <div className="sp-card" key={f.title}><div className="sp-card-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
          </div>
        </div>
      </section>
      <CTABanner title="Let's Build Something Amazing" subtitle="Tell us your idea and we'll build a custom solution that perfectly fits your business needs." />
    </ServiceLayout>
  );
}
