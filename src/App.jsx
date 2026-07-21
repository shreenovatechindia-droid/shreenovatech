import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { trackPageView } from './analytics.js';

// Admin Panel
import AdminLayout    from './pages/admin/AdminLayout';
import AdminLogin     from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings  from './pages/admin/AdminBookings';
import AdminPayments  from './pages/admin/AdminPayments';
import AdminContacts  from './pages/admin/AdminContacts';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminPricing   from './pages/admin/AdminPricing';
import AdminSettings  from './pages/admin/AdminSettings';
import { ToastProvider } from './pages/admin/Toast';
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

import FloatingContactWidget from './components/FloatingContactWidget';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/global.css';
import './css/sections.css';
import './css/responsive.css';
import './css/service-pages.css';

// Route change pe page view track karo
function GATracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <GATracker />
      <FloatingContactWidget />
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

        {/* Admin Panel */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bookings"  element={<AdminBookings />} />
          <Route path="payments"  element={<AdminPayments />} />
          <Route path="contacts"  element={<AdminContacts />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="pricing"   element={<AdminPricing />} />
          <Route path="settings"  element={<AdminSettings />} />
        </Route>

        {/* Hash-section redirects */}
        <Route path="/portfolio" element={<Navigate to="/#portfolio" replace />} />
        <Route path="/pricing"   element={<Navigate to="/#pricing"   replace />} />
        <Route path="/contact"   element={<Navigate to="/#contact"   replace />} />
      </Routes>
    </BrowserRouter>
  );
}
