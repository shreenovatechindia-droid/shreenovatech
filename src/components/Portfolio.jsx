import { useState, useEffect } from 'react';
import { FiArrowRight, FiX, FiShare2, FiMail, FiExternalLink } from 'react-icons/fi';
import { getPortfolio } from '../utils/api';
import '../css/sections.css';
import './Portfolio.css';

const FALLBACK = [
  { id:1, img:'/p1.jpg', image_url:'/p1.jpg', category:'E-Commerce', title:'Luxury Way Jewellery', badge:'Luxury Jewellery E-Commerce', industry:'Jewellery', description:'Luxury Way Jewellery is a premium online jewellery store designed with a modern dark luxury interface. The website showcases elegant jewellery collections, secure online shopping, responsive layouts, premium product pages, advanced search, wishlist functionality and a seamless checkout experience for customers.', features:['Premium Dark UI','Product Catalogue','Wishlist','Shopping Cart','Secure Checkout','Responsive Design','Product Categories','Search Functionality'], tech:['HTML5','CSS3','Bootstrap','JavaScript','React'] },
  { id:2, img:'/p2.jpg', image_url:'/p2.jpg', category:'Websites', title:'UrbanNest Properties', badge:'Real Estate Website', industry:'Real Estate', description:'UrbanNest Properties is a modern real estate platform where users can browse premium residential and commercial properties.', features:['Property Search','Featured Properties','Contact Agent','Responsive Design','Property Gallery','Google Maps','Enquiry Form'], tech:['React','Bootstrap','Node.js'] },
  { id:3, img:'/p3.jpg', image_url:'/p3.jpg', category:'Websites', title:'MediCare Plus', badge:'Hospital Website', industry:'Healthcare', description:'MediCare Plus is a professional healthcare website developed for hospitals and clinics.', features:['Appointment Booking','Doctor Profiles','Emergency Services','Responsive Design','Health Packages','Contact Form'], tech:['React','Bootstrap','PHP'] },
  { id:4, img:'/p4.jpg', image_url:'/p4.jpg', category:'E-Commerce', title:'StyleHub Fashion', badge:'Fashion E-Commerce', industry:'Fashion', description:'StyleHub Fashion is a stylish online fashion store offering modern clothing collections.', features:['Fashion Catalogue','Shopping Cart','Product Filter','Responsive Design','Wishlist','Secure Checkout'], tech:['React','Bootstrap','Node.js'] },
  { id:5, img:'/p5.jpg', image_url:'/p5.jpg', category:'Websites', title:'Digix Agency', badge:'Digital Marketing Website', industry:'Digital Marketing', description:'Digix Agency is a creative digital marketing website showcasing branding, SEO, advertising and Google Ads.', features:['SEO Services','Branding','Google Ads','Analytics','Lead Generation','Responsive UI'], tech:['React','Bootstrap'] },
  { id:6, img:'/p6.jpg', image_url:'/p6.jpg', category:'Websites', title:'EduLearn Platform', badge:'Education Website', industry:'Education', description:'EduLearn Platform is an online learning portal with courses, instructors, student dashboard and certification.', features:['Online Courses','Student Dashboard','Certificate','Responsive Design','Video Lessons'], tech:['React','Bootstrap'] },
  { id:7, img:'/p7.jpg', image_url:'/p7.jpg', category:'Landing Pages', title:'FoodExpress', badge:'Restaurant Website', industry:'Food & Beverage', description:'FoodExpress is a modern restaurant website with online ordering, digital menu and reservations.', features:['Online Ordering','Digital Menu','Reservations','Responsive Design','Food Gallery'], tech:['React','Bootstrap'] },
  { id:8, img:'/p8.jpg', image_url:'/p8.jpg', category:'SEO Projects', title:'Travel Explorer', badge:'Travel Agency Website', industry:'Travel & Tourism', description:'Travel Explorer offers tour packages, destination galleries, travel booking and enquiry management.', features:['Tour Packages','Destination Gallery','Travel Booking','Enquiry Form','Responsive Design'], tech:['React','Bootstrap','Node.js'] },
  { id:9, img:'/p9.jpg', image_url:'/p9.jpg', category:'Branding', title:'FinancePro', badge:'Finance Website', industry:'Finance', description:'FinancePro provides investment consulting, loan services, insurance information and secure enquiry management.', features:['Investment Consulting','Loan Services','Insurance Info','Enquiry Management','Responsive Design'], tech:['React','Bootstrap'] },
  { id:10, img:'/p10.jpg', image_url:'/p10.jpg', category:'E-Commerce', title:'ShreeNova Tech', badge:'Corporate Business Website', industry:'Information Technology', description:'ShreeNova Tech is a premium IT company website showcasing Website Development, Mobile App Development, Cloud Hosting, SEO and Digital Marketing.', features:['Website Development','Mobile App Dev','Cloud Hosting','SEO Services','Digital Marketing','CRM Development','ERP Solutions','Business Automation'], tech:['React','Bootstrap','Node.js','PHP'] },
];

const filters = ['All Projects', 'Websites', 'E-Commerce', 'Landing Pages', 'SEO Projects', 'Branding'];

export default function Portfolio() {
  const [projects, setProjects] = useState(FALLBACK);
  const [active, setActive]     = useState('All Projects');
  const [modal, setModal]       = useState(null);

  useEffect(() => {
    getPortfolio()
      .then(r => { if (r.data?.data?.length) setProjects(r.data.data); })
      .catch(() => {});
  }, []);

  const visible = active === 'All Projects' ? projects : projects.filter(p => p.category === active);

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modal]);

  const imgSrc = item => item.image_url || item.img || '';

  return (
    <section className="portfolio-section" id="portfolio">
      <div className="container">
        <h2 className="pf-heading">Our <span className="pf-green">Portfolio</span></h2>
        <p className="pf-subtitle">A glimpse of our premium web design work delivered to clients across India.</p>

        <div className="pf-filters" data-aos="fade-up">
          {filters.map(f => (
            <button key={f} className={`pf-filter-btn ${active === f ? 'pf-filter-active' : ''}`} onClick={() => setActive(f)}>{f}</button>
          ))}
        </div>

        <div className="pf-grid" data-aos="fade-up">
          {visible.map(item => (
            <div className="pf-card" key={item.id}>
              <div className="pf-card-img">
                <img src={imgSrc(item)} alt={item.title} loading="lazy" />
                <div className="pf-card-overlay">
                  <button className="pf-demo-btn" onClick={() => setModal(item)}>
                    View Project <FiArrowRight size={14} />
                  </button>
                </div>
              </div>
              <div className="pf-card-info">
                <div>
                  <div className="pf-card-title">{item.title}</div>
                  <div className="pf-card-type">{item.badge}</div>
                </div>
                <button className="pf-live-demo" onClick={() => setModal(item)}>
                  Live Demo <FiArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div className="pm-backdrop" onClick={() => setModal(null)}>
          <div className="pm-modal" onClick={e => e.stopPropagation()}>
            <button className="pm-close" onClick={() => setModal(null)}><FiX size={20} /></button>
            <div className="pm-body">
              <div className="pm-left">
                <div className="pm-img-wrap">
                  <img src={imgSrc(modal)} alt={modal.title} />
                </div>
                <div className="pm-img-meta">
                  <div className="pm-meta-item"><span>Project Type</span><strong>{modal.badge}</strong></div>
                  <div className="pm-meta-item"><span>Client Industry</span><strong>{modal.industry}</strong></div>
                  <div className="pm-meta-item"><span>Responsive Design</span><strong>✅ Yes</strong></div>
                </div>
              </div>
              <div className="pm-right">
                <span className="pm-badge">{modal.badge}</span>
                <h2 className="pm-title">{modal.title}</h2>
                <p className="pm-desc">{modal.description}</p>
                <div className="pm-section-label">Key Features</div>
                <ul className="pm-features">
                  {(modal.features || []).map(f => (
                    <li key={f}><span className="pm-tick">✓</span>{f}</li>
                  ))}
                </ul>
                <div className="pm-section-label">Technologies Used</div>
                <div className="pm-tech-tags">
                  {(modal.tech || []).map(t => <span key={t} className="pm-tag">{t}</span>)}
                </div>
                <div className="pm-btns">
                  {modal.live_url
                    ? <a href={modal.live_url} target="_blank" rel="noreferrer" className="pm-btn-primary"><FiExternalLink size={15} /> Live Demo</a>
                    : <button className="pm-btn-primary" onClick={() => setModal(null)}><FiExternalLink size={15} /> Live Demo</button>
                  }
                  <a href="#contact" className="pm-btn-orange" onClick={() => setModal(null)}>
                    <FiMail size={15} /> Contact Us
                  </a>
                  <button className="pm-btn-outline" onClick={() => navigator.share?.({ title: modal.title, url: window.location.href })}>
                    <FiShare2 size={14} /> Share Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
