import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PaymentPage from './pages/PaymentPage';
import BookingPage from './pages/BookingPage';

// Hosting
import HostingPage from './pages/HostingPage';
import { SharedHostingPage, CloudHostingPage, VPSHostingPage, WordPressHostingPage } from './pages/HostingSubPages';

// Website Development
import WebDevPage, { BusinessWebsitePage, EcommercePage, LandingPageService, CustomDevPage } from './pages/WebDevPages';

// Digital Marketing
import DigitalMarketingPage, { SocialMediaPage, GoogleAdsPage, ContentMarketingPage, EmailMarketingPage } from './pages/DigitalMarketingPages';

// SEO
import SEOPage from './pages/SEOPage';
import AboutPage from './pages/AboutPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/global.css';
import './css/sections.css';
import './css/responsive.css';
import './css/service-pages.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/book-now" element={<BookingPage />} />

        {/* Hosting */}
        <Route path="/hosting"            element={<HostingPage />} />
        <Route path="/shared-hosting"     element={<SharedHostingPage />} />
        <Route path="/cloud-hosting"      element={<CloudHostingPage />} />
        <Route path="/vps-hosting"        element={<VPSHostingPage />} />
        <Route path="/wordpress-hosting"  element={<WordPressHostingPage />} />

        {/* Website Development */}
        <Route path="/website-development" element={<WebDevPage />} />
        <Route path="/business-website"    element={<BusinessWebsitePage />} />
        <Route path="/ecommerce-website"   element={<EcommercePage />} />
        <Route path="/landing-page"        element={<LandingPageService />} />
        <Route path="/custom-development"  element={<CustomDevPage />} />

        {/* Digital Marketing */}
        <Route path="/digital-marketing"  element={<DigitalMarketingPage />} />
        <Route path="/social-media"       element={<SocialMediaPage />} />
        <Route path="/google-ads"         element={<GoogleAdsPage />} />
        <Route path="/content-marketing"  element={<ContentMarketingPage />} />
        <Route path="/email-marketing"    element={<EmailMarketingPage />} />

        {/* SEO */}
        <Route path="/seo-services" element={<SEOPage />} />

        {/* About */}
        <Route path="/about" element={<AboutPage />} />

        {/* Hash-section redirects */}
        <Route path="/portfolio" element={<Navigate to="/#portfolio" replace />} />
        <Route path="/pricing"   element={<Navigate to="/#pricing"   replace />} />
        <Route path="/contact"   element={<Navigate to="/#contact"   replace />} />
      </Routes>
    </BrowserRouter>
  );
}
