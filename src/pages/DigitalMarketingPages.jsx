import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import ServiceLayout, { ServiceHero, FAQ, CTABanner, Reviews } from '../components/ServiceLayout';

const faqs = [
  { q:'What is digital marketing?', a:'Digital marketing is the promotion of your business through online channels like Google, Facebook, Instagram, email and SEO to reach your target audience and generate leads.' },
  { q:'How long does it take to see results?', a:'SEO results typically take 3–6 months. Google Ads and social media ads can generate leads within 24–48 hours of campaign launch.' },
  { q:'What is your minimum budget for Google Ads?', a:'We recommend a minimum ad spend of ₹10,000/month for Google Ads campaigns to see meaningful results.' },
  { q:'Do you provide monthly reports?', a:'Yes. We provide detailed monthly reports showing campaign performance, leads generated, cost per lead and ROI.' },
];

/* ── Digital Marketing Main ── */
export default function DigitalMarketingPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <ServiceLayout>
      <ServiceHero badge="Digital Marketing" title="Grow Your Business with" highlight="Digital Marketing" desc="Reach more customers, generate more leads and grow your revenue with our data-driven digital marketing services. From Google Ads to social media — we deliver measurable results." breadcrumb={[{ label:'Digital Marketing' }]} stats={[{ value:'500+', label:'Campaigns Run' },{ value:'10x', label:'Average ROI' },{ value:'24/7', label:'Campaign Monitoring' },{ value:'Monthly', label:'Detailed Reports' }]} />

      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Our Digital Marketing <span>Services</span></h2><p>Comprehensive digital marketing solutions to grow your business online.</p></div>
          <div className="sp-cards">
            {[
              { icon:'📱', title:'Social Media Marketing', desc:'Grow your brand on Facebook, Instagram, LinkedIn and other platforms with engaging content.', link:'/social-media' },
              { icon:'🎯', title:'Google Ads', desc:'Targeted Google Search, Display and Shopping ads that drive qualified traffic to your website.', link:'/google-ads' },
              { icon:'✍️', title:'Content Marketing', desc:'SEO-optimized content that attracts organic traffic and establishes your brand authority.', link:'/content-marketing' },
              { icon:'📧', title:'Email Marketing', desc:'Automated email campaigns that nurture leads and convert them into paying customers.', link:'/email-marketing' },
              { icon:'📊', title:'Analytics & Reporting', desc:'Detailed performance reports with actionable insights to continuously improve your campaigns.' },
              { icon:'🎯', title:'Lead Generation', desc:'Targeted campaigns designed to generate high-quality leads for your sales team.' },
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

      <section className="sp-section sp-section-light">
        <div className="container">
          <div className="sp-section-head"><h2>Why Digital Marketing <span>Matters</span></h2><p>In today's digital world, your customers are online. Your business needs to be there too.</p></div>
          <div className="sp-two-col">
            <div>
              <h2>Turn Online Presence into <span>Real Revenue</span></h2>
              <p>Digital marketing is the most cost-effective way to reach your target audience, generate leads and grow your business. Unlike traditional advertising, every rupee spent on digital marketing is trackable and measurable.</p>
              <ul className="sp-checklist">
                {['Reach thousands of potential customers daily','Target specific demographics and locations','Track every lead and conversion','Lower cost per lead than traditional marketing','Build brand awareness and trust online','Compete with larger businesses effectively'].map(i => <li key={i}><span className="sp-check">✓</span>{i}</li>)}
              </ul>
            </div>
            <div className="sp-two-col-img">📊</div>
          </div>
        </div>
      </section>

      <Reviews />
      <section className="sp-section sp-section-light"><div className="container" style={{ maxWidth:760 }}><div className="sp-section-head"><h2>Frequently Asked <span>Questions</span></h2></div><FAQ items={faqs} /></div></section>
      <CTABanner title="Start Growing Your Business Online" subtitle="Get a free digital marketing consultation and discover how we can grow your business." />
    </ServiceLayout>
  );
}

/* ── Social Media ── */
export function SocialMediaPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <ServiceLayout>
      <ServiceHero badge="Social Media Marketing" title="Grow Your Brand on" highlight="Social Media" desc="Build a powerful social media presence that engages your audience, builds brand loyalty and drives real business results across Facebook, Instagram, LinkedIn and more." breadcrumb={[{ label:'Digital Marketing', path:'/digital-marketing' },{ label:'Social Media' }]} stats={[{ value:'10x', label:'Engagement Growth' },{ value:'Daily', label:'Content Posting' },{ value:'All', label:'Platforms Covered' },{ value:'Monthly', label:'Reports' }]} />
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Social Media Marketing <span>Services</span></h2><p>Complete social media management to grow your brand and engage your audience.</p></div>
          <div className="sp-cards">
            {[{ icon:'📘', title:'Facebook Marketing', desc:'Facebook page management, content creation, ads and community engagement.' },{ icon:'📸', title:'Instagram Marketing', desc:'Instagram feed, stories, reels and influencer marketing to grow your following.' },{ icon:'💼', title:'LinkedIn Marketing', desc:'Professional LinkedIn presence for B2B lead generation and brand authority.' },{ icon:'🎬', title:'YouTube Marketing', desc:'YouTube channel management, video content and YouTube ads for maximum reach.' },{ icon:'🎯', title:'Paid Social Ads', desc:'Targeted Facebook and Instagram ads with precise audience targeting and retargeting.' },{ icon:'📊', title:'Analytics & Reporting', desc:'Monthly performance reports with engagement metrics, reach and conversion data.' }].map(f => <div className="sp-card" key={f.title}><div className="sp-card-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
          </div>
        </div>
      </section>
      <CTABanner title="Build Your Social Media Presence" subtitle="Professional social media management that grows your brand and generates leads." />
    </ServiceLayout>
  );
}

/* ── Google Ads ── */
export function GoogleAdsPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <ServiceLayout>
      <ServiceHero badge="Google Ads" title="Get More Customers with" highlight="Google Ads" desc="Reach customers who are actively searching for your products and services. Our certified Google Ads experts create campaigns that deliver maximum ROI for your budget." breadcrumb={[{ label:'Digital Marketing', path:'/digital-marketing' },{ label:'Google Ads' }]} stats={[{ value:'Certified', label:'Google Partner' },{ value:'3x', label:'Average ROI' },{ value:'24/7', label:'Campaign Monitoring' },{ value:'Weekly', label:'Performance Reports' }]} />
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Google Ads <span>Services</span></h2><p>Complete Google Ads management to drive qualified traffic and generate leads for your business.</p></div>
          <div className="sp-cards">
            {[{ icon:'🔍', title:'Search Ads', desc:'Text ads that appear when customers search for your products or services on Google.' },{ icon:'🖼️', title:'Display Ads', desc:'Visual banner ads shown across millions of websites in the Google Display Network.' },{ icon:'🛒', title:'Shopping Ads', desc:'Product listing ads that show your products directly in Google search results.' },{ icon:'📈', title:'Performance Max', desc:'AI-powered campaigns that optimize across all Google channels for maximum conversions.' },{ icon:'🔄', title:'Remarketing', desc:'Re-engage visitors who have previously visited your website with targeted ads.' },{ icon:'📊', title:'Conversion Tracking', desc:'Track every lead, call and sale generated from your Google Ads campaigns.' }].map(f => <div className="sp-card" key={f.title}><div className="sp-card-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
          </div>
        </div>
      </section>
      <CTABanner title="Start Your Google Ads Campaign Today" subtitle="Get more leads and sales with expertly managed Google Ads campaigns." />
    </ServiceLayout>
  );
}

/* ── Content Marketing ── */
export function ContentMarketingPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <ServiceLayout>
      <ServiceHero badge="Content Marketing" title="Attract Customers with" highlight="Content Marketing" desc="High-quality, SEO-optimized content that attracts organic traffic, builds brand authority and converts readers into customers." breadcrumb={[{ label:'Digital Marketing', path:'/digital-marketing' },{ label:'Content Marketing' }]} stats={[{ value:'SEO', label:'Optimized Content' },{ value:'3x', label:'More Organic Traffic' },{ value:'Expert', label:'Content Writers' },{ value:'Monthly', label:'Content Calendar' }]} />
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Content Marketing <span>Services</span></h2><p>Professional content creation that drives organic traffic and establishes your brand as an industry authority.</p></div>
          <div className="sp-cards">
            {[{ icon:'✍️', title:'SEO Blog Writing', desc:'Keyword-optimized blog posts that rank on Google and drive organic traffic to your website.' },{ icon:'🌐', title:'Website Content', desc:'Professional website copy that communicates your value proposition and converts visitors.' },{ icon:'📄', title:'Business Content', desc:'Company profiles, product descriptions, case studies and business presentations.' },{ icon:'📱', title:'Social Media Content', desc:'Engaging social media posts, captions and stories for all platforms.' },{ icon:'📧', title:'Email Content', desc:'Compelling email newsletters and campaigns that engage your subscribers.' },{ icon:'📊', title:'Content Strategy', desc:'Comprehensive content strategy aligned with your business goals and target audience.' }].map(f => <div className="sp-card" key={f.title}><div className="sp-card-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
          </div>
        </div>
      </section>
      <CTABanner title="Build Your Content Marketing Strategy" subtitle="Professional content that attracts, engages and converts your target audience." />
    </ServiceLayout>
  );
}

/* ── Email Marketing ── */
export function EmailMarketingPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <ServiceLayout>
      <ServiceHero badge="Email Marketing" title="Grow Revenue with" highlight="Email Marketing" desc="Automated email marketing campaigns that nurture leads, retain customers and drive repeat sales. The highest ROI digital marketing channel for your business." breadcrumb={[{ label:'Digital Marketing', path:'/digital-marketing' },{ label:'Email Marketing' }]} stats={[{ value:'42x', label:'Average ROI' },{ value:'Automated', label:'Campaigns' },{ value:'High', label:'Deliverability' },{ value:'Detailed', label:'Analytics' }]} />
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Email Marketing <span>Services</span></h2><p>Complete email marketing solutions to grow your business through targeted, automated campaigns.</p></div>
          <div className="sp-cards">
            {[{ icon:'📧', title:'Bulk Email Campaigns', desc:'Send professional bulk emails to thousands of subscribers with high deliverability rates.' },{ icon:'📰', title:'Newsletter Design', desc:'Beautiful, mobile-responsive newsletter templates that engage your subscribers.' },{ icon:'🤖', title:'Email Automation', desc:'Automated email sequences triggered by user actions to nurture leads automatically.' },{ icon:'🎯', title:'Lead Nurturing', desc:'Strategic email sequences that guide prospects through your sales funnel.' },{ icon:'📊', title:'Campaign Analytics', desc:'Detailed reports on open rates, click rates, conversions and revenue generated.' },{ icon:'🔧', title:'List Management', desc:'Professional email list segmentation and management for targeted campaigns.' }].map(f => <div className="sp-card" key={f.title}><div className="sp-card-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
          </div>
        </div>
      </section>
      <CTABanner title="Start Your Email Marketing Campaign" subtitle="Automated email marketing that generates leads and drives repeat sales for your business." />
    </ServiceLayout>
  );
}
