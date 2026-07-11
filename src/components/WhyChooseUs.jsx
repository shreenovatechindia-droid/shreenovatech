import { FiTool, FiUsers, FiShield } from 'react-icons/fi';
import '../css/sections.css';

const cards = [
  {
    icon: <FiTool size={32} />,
    title: 'Start with 21 Advance',
    desc: 'Get your slot today and start your website journey with 21 Advance tools for your site.',
  },
  {
    icon: <FiUsers size={32} />,
    title: 'Trusted by 200+ Clients',
    desc: 'Proven brand across India with satisfied clients across multiple industries.',
  },
  {
    icon: <FiShield size={32} />,
    title: 'No Hidden Charges',
    desc: 'Transparent pricing, no extra fees, & 100% client satisfaction guarantee.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-section">
      <div className="container">
        <h2 className="section-title">
          Why <span className="text-green">Choose</span> Us
        </h2>
        <p className="section-subtitle">
          We deliver premium web solutions with transparency, quality, and unmatched support.
        </p>
        <div className="row g-4">
          {cards.map((c) => (
            <div className="col-lg-4 col-md-6" key={c.title} data-aos="zoom-in">
              <div className="why-card">
                <div className="why-icon">{c.icon}</div>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
