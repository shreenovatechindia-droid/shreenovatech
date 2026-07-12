import ReactGA from 'react-ga4';

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// ─── Initialize GA4 ───────────────────────────────────────────────────────────
export const initGA = () => {
  if (!MEASUREMENT_ID || MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.warn('GA4: Measurement ID set nahi hai .env mein');
    return;
  }
  ReactGA.initialize(MEASUREMENT_ID, {
    gaOptions: { send_page_view: false }, // manual page tracking karenge
  });
};

// ─── Page View Track karo ─────────────────────────────────────────────────────
// App.jsx mein route change pe call hoga
export const trackPageView = (path, title) => {
  ReactGA.send({ hitType: 'pageview', page: path, title });
};

// ─── Generic Event Track karo ─────────────────────────────────────────────────
// trackEvent('button_click', { button_name: 'Get Quote' })
export const trackEvent = (eventName, params = {}) => {
  ReactGA.event(eventName, params);
};

// ─── Pre-built Events ─────────────────────────────────────────────────────────

// WhatsApp button click
export const trackWhatsApp = (source = 'unknown') => {
  trackEvent('whatsapp_click', { source });
};

// Call button click
export const trackCall = (source = 'unknown') => {
  trackEvent('call_click', { source });
};

// Email button click
export const trackEmail = (source = 'unknown') => {
  trackEvent('email_click', { source });
};

// Contact form submit
export const trackContactForm = () => {
  trackEvent('contact_form_submit', { form_name: 'contact' });
  // Conversion bhi fire karo
  ReactGA.event('conversion', { send_to: MEASUREMENT_ID });
};

// CTA / Get Quote button
export const trackCTA = (buttonName, pageName) => {
  trackEvent('cta_click', { button_name: buttonName, page: pageName });
};

// Service page visit
export const trackServiceView = (serviceName) => {
  trackEvent('service_view', { service_name: serviceName });
};
