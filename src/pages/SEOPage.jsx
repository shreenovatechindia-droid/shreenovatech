import { useEffect } from 'react';
import ServiceLayout, { ServiceHero, FAQ, CTABanner, Reviews } from '../components/ServiceLayout';

const faqs = [
  { q:'How long does SEO take to show results?', a:'SEO is a long-term strategy. You can expect to see initial improvements in 2–3 months, with significant results in 4–6 months depending on competition and website age.' },
  { q:'Do you guarantee first page rankings?', a:'No ethical SEO agency can guarantee specific rankings as Google\'s algorithm is constantly changing. However, we use proven strategies that consistently improve rankings over time.' },
  { q:'What is included in your SEO service?', a:'Our SEO service includes keyword research, on-page optimization, technical SEO, link building, content optimization, Google Search Console setup and monthly performance reports.' },
  { q:'Do you work on local SEO?', a:'Yes. We specialize in local SEO to help your business appear in Google Maps and local search results for customers in your area.' },
  { q:'How do you measure SEO success?', a:'We track keyword rankings, organic traffic, leads generated, bounce rate and conversion rate. You receive detailed monthly reports with all these metrics.' },
];

export default function SEOPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <ServiceLayout>
      <ServiceHero badge="SEO Services" title="Rank Higher on Google with" highlight="Expert SEO" desc="Dominate Google search results and drive organic traffic to your website. Our proven SEO strategies help businesses across India rank higher, get more visitors and generate more leads." breadcrumb={[{ label:'SEO Services' }]} stats={[{ value:'Top 10', label:'Google Rankings' },{ value:'3x', label:'More Organic Traffic' },{ value:'Monthly', label:'Detailed Reports' },{ value:'100+', label:'Keywords Tracked' }]} />

      {/* Services */}
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Our Comprehensive <span>SEO Services</span></h2><p>A complete SEO strategy covering every aspect of search engine optimization for maximum results.</p></div>
          <div className="sp-cards">
            {[{ icon:'📄', title:'On-Page SEO', desc:'Optimize title tags, meta descriptions, headings, content and internal linking for better rankings.' },{ icon:'🔗', title:'Off-Page SEO', desc:'High-quality backlink building from authoritative websites to boost your domain authority.' },{ icon:'⚙️', title:'Technical SEO', desc:'Fix crawl errors, improve site speed, mobile optimization and structured data markup.' },{ icon:'📍', title:'Local SEO', desc:'Optimize your Google Business Profile and local citations to rank in local search results.' },{ icon:'🔍', title:'Keyword Research', desc:'In-depth keyword research to identify high-value search terms your customers use.' },{ icon:'🏆', title:'Competitor Analysis', desc:'Analyze competitor strategies and identify opportunities to outrank them on Google.' },{ icon:'📊', title:'Google Search Console', desc:'Setup and monitoring of Google Search Console for performance tracking and issue resolution.' },{ icon:'📈', title:'Monthly Reports', desc:'Detailed monthly reports showing keyword rankings, traffic growth and leads generated.' },{ icon:'✍️', title:'SEO Content Writing', desc:'Keyword-optimized content that ranks on Google and provides value to your visitors.' }].map(f => <div className="sp-card" key={f.title}><div className="sp-card-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
          </div>
        </div>
      </section>

      {/* Why SEO */}
      <section className="sp-section sp-section-light">
        <div className="container">
          <div className="sp-section-head"><h2>Why Your Business <span>Needs SEO</span></h2><p>93% of online experiences begin with a search engine. If you're not on page 1, you're invisible to potential customers.</p></div>
          <div className="sp-two-col">
            <div className="sp-two-col-img">🔍</div>
            <div>
              <h2>Get Found by Customers <span>Searching for You</span></h2>
              <p>SEO is the most cost-effective long-term digital marketing strategy. Unlike paid ads that stop the moment you stop paying, SEO builds lasting organic visibility that continues to generate leads month after month.</p>
              <ul className="sp-checklist">
                {['Appear on page 1 of Google search results','Drive targeted organic traffic to your website','Generate leads without paying for every click','Build long-term brand authority and trust','Outrank your competitors in local search','Increase website conversions and revenue'].map(i => <li key={i}><span className="sp-check">✓</span>{i}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="sp-section sp-section-white">
        <div className="container">
          <div className="sp-section-head"><h2>Our SEO <span>Process</span></h2><p>A systematic approach to SEO that delivers consistent, measurable results.</p></div>
          <div className="sp-process">
            {[{ n:1, title:'SEO Audit', desc:'Complete analysis of your current website SEO performance and issues.' },{ n:2, title:'Keyword Research', desc:'Identify high-value keywords your target customers are searching for.' },{ n:3, title:'On-Page Optimization', desc:'Optimize all on-page elements for target keywords and user experience.' },{ n:4, title:'Link Building', desc:'Build high-quality backlinks to increase domain authority and rankings.' },{ n:5, title:'Monitor & Report', desc:'Track rankings, traffic and leads with monthly performance reports.' }].map(p => <div className="sp-process-step" key={p.n}><div className="sp-process-num">{p.n}</div><h4>{p.title}</h4><p>{p.desc}</p></div>)}
          </div>
        </div>
      </section>

      <Reviews />
      <section className="sp-section sp-section-light"><div className="container" style={{ maxWidth:760 }}><div className="sp-section-head"><h2>Frequently Asked <span>Questions</span></h2></div><FAQ items={faqs} /></div></section>
      <CTABanner title="Start Ranking Higher on Google" subtitle="Get a free SEO audit and discover how we can grow your organic traffic and leads." />
    </ServiceLayout>
  );
}
