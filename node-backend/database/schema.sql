-- ============================================================
-- ShreeNova Tech — PostgreSQL Schema (Supabase)
-- ============================================================

-- ── Admin Users ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id             SERIAL PRIMARY KEY,
  username       VARCHAR(50)  NOT NULL UNIQUE,
  email          VARCHAR(100) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  full_name      VARCHAR(100) DEFAULT '',
  role           VARCHAR(20)  DEFAULT 'admin',
  is_active      BOOLEAN      DEFAULT TRUE,
  last_login     TIMESTAMP    DEFAULT NULL,
  remember_token VARCHAR(100) DEFAULT NULL,
  reset_token    VARCHAR(100) DEFAULT NULL,
  reset_expires  TIMESTAMP    DEFAULT NULL,
  created_at     TIMESTAMP    DEFAULT NOW(),
  updated_at     TIMESTAMP    DEFAULT NOW()
);

-- Default admin: admin@shreenovatech.in / password
INSERT INTO admin_users (username, email, password_hash, full_name, role)
VALUES ('admin', 'admin@shreenovatech.in',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Super Admin', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- ── Bookings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id           SERIAL PRIMARY KEY,
  ref_id       VARCHAR(30)  NOT NULL UNIQUE,
  full_name    VARCHAR(100) NOT NULL,
  mobile       VARCHAR(15)  NOT NULL,
  whatsapp     VARCHAR(15)  DEFAULT '',
  email        VARCHAR(100) NOT NULL,
  company      VARCHAR(100) DEFAULT '',
  business     VARCHAR(100) DEFAULT '',
  website      VARCHAR(200) DEFAULT '',
  city         VARCHAR(50)  DEFAULT '',
  state        VARCHAR(50)  DEFAULT '',
  country      VARCHAR(50)  DEFAULT 'India',
  project_type VARCHAR(100) DEFAULT '',
  budget       VARCHAR(50)  DEFAULT '',
  timeline     VARCHAR(50)  DEFAULT '',
  description  TEXT,
  services     JSONB,
  logo_url     VARCHAR(500) DEFAULT '',
  images_url   VARCHAR(500) DEFAULT '',
  docs_url     VARCHAR(500) DEFAULT '',
  status       VARCHAR(20)  DEFAULT 'new',
  admin_notes  TEXT,
  created_at   TIMESTAMP    DEFAULT NOW(),
  updated_at   TIMESTAMP    DEFAULT NOW()
);

-- ── Payments ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id              SERIAL PRIMARY KEY,
  ref_id          VARCHAR(30)    NOT NULL UNIQUE,
  full_name       VARCHAR(100)   NOT NULL,
  mobile          VARCHAR(15)    NOT NULL,
  whatsapp        VARCHAR(15)    DEFAULT '',
  email           VARCHAR(100)   NOT NULL,
  company         VARCHAR(100)   DEFAULT '',
  gst             VARCHAR(20)    DEFAULT '',
  address         TEXT,
  city            VARCHAR(50)    DEFAULT '',
  state           VARCHAR(50)    DEFAULT '',
  country         VARCHAR(50)    DEFAULT 'India',
  pincode         VARCHAR(10)    DEFAULT '',
  package_key     VARCHAR(20)    DEFAULT 'silver',
  package_name    VARCHAR(100)   DEFAULT '',
  amount          DECIMAL(10,2)  DEFAULT 0,
  gst_amount      DECIMAL(10,2)  DEFAULT 0,
  total_amount    DECIMAL(10,2)  DEFAULT 0,
  pay_method      VARCHAR(50)    DEFAULT '',
  transaction_id  VARCHAR(100)   DEFAULT '',
  screenshot_url  VARCHAR(500)   DEFAULT '',
  status          VARCHAR(20)    DEFAULT 'pending',
  admin_notes     TEXT,
  verified_by     INT            DEFAULT NULL,
  verified_at     TIMESTAMP      DEFAULT NULL,
  created_at      TIMESTAMP      DEFAULT NOW(),
  updated_at      TIMESTAMP      DEFAULT NOW()
);

-- ── Contacts ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL,
  phone       VARCHAR(15)  DEFAULT '',
  message     TEXT         NOT NULL,
  status      VARCHAR(20)  DEFAULT 'new',
  reply_text  TEXT,
  replied_by  INT          DEFAULT NULL,
  replied_at  TIMESTAMP    DEFAULT NULL,
  ip_address  VARCHAR(45)  DEFAULT '',
  created_at  TIMESTAMP    DEFAULT NOW()
);

-- ── Portfolio ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(200) NOT NULL,
  category         VARCHAR(50)  NOT NULL,
  badge            VARCHAR(50)  DEFAULT '',
  industry         VARCHAR(100) DEFAULT '',
  description      TEXT,
  features         JSONB,
  tech             JSONB,
  image_url        VARCHAR(500) DEFAULT '',
  live_url         VARCHAR(500) DEFAULT '',
  github_url       VARCHAR(500) DEFAULT '',
  client_name      VARCHAR(100) DEFAULT '',
  completion_date  DATE         DEFAULT NULL,
  is_featured      BOOLEAN      DEFAULT FALSE,
  sort_order       INT          DEFAULT 0,
  is_active        BOOLEAN      DEFAULT TRUE,
  created_at       TIMESTAMP    DEFAULT NOW(),
  updated_at       TIMESTAMP    DEFAULT NOW()
);

INSERT INTO portfolio (title, category, badge, industry, description, features, tech, image_url, live_url, is_featured, sort_order) VALUES
('Business Website',  'Websites',      'Live', 'Business',  'Professional business website',  '["Responsive","SEO Optimized","Fast Loading"]', '["HTML","CSS","JavaScript"]', '/p1.jpg', '#', TRUE, 1),
('E-Commerce Store',  'E-Commerce',    'Live', 'Retail',    'Full featured online store',      '["Cart","Payment Gateway","Admin Panel"]',      '["React","Node.js","MySQL"]', '/p2.jpg', '#', TRUE, 2),
('Landing Page',      'Landing Pages', 'Live', 'Marketing', 'High converting landing page',    '["A/B Testing","Analytics","Fast"]',            '["HTML","CSS","JS"]',        '/p3.jpg', '#', FALSE, 3)
ON CONFLICT DO NOTHING;

-- ── Pricing Plans ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_plans (
  id          SERIAL PRIMARY KEY,
  badge       VARCHAR(20)  DEFAULT '',
  badge_class VARCHAR(50)  DEFAULT '',
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  price       VARCHAR(30)  NOT NULL,
  price_num   INT          DEFAULT 0,
  renewal     VARCHAR(100) DEFAULT '',
  is_featured BOOLEAN      DEFAULT FALSE,
  features    JSONB,
  sort_order  INT          DEFAULT 0,
  is_active   BOOLEAN      DEFAULT TRUE,
  created_at  TIMESTAMP    DEFAULT NOW(),
  updated_at  TIMESTAMP    DEFAULT NOW()
);

INSERT INTO pricing_plans (badge, badge_class, name, description, price, price_num, renewal, is_featured, features, sort_order) VALUES
('SILVER',  'badge-silver',  'Silver Package',  'Perfect for small businesses', '₹9,999',  9999,  '+ ₹2,000/year renewal', FALSE, '["Free Domain (1 Year)","Free Hosting (1 Year)","5 Pages Website","Responsive Design","Basic SEO","WhatsApp Button","Contact Form","1 Year Free Support"]', 1),
('GOLDEN',  'badge-golden',  'Golden Package',  'Best for growing businesses',  '₹14,999', 14999, '+ ₹3,000/year renewal', TRUE,  '["Free Domain (1 Year)","Free Hosting (1 Year)","10 Pages Website","Responsive Design","Advanced SEO","WhatsApp Button","Contact Form","Blog Section","Google Analytics","Social Media Integration","1 Year Free Support"]', 2),
('DIAMOND', 'badge-diamond', 'Diamond Package', 'Complete digital solution',    '₹19,999', 19999, '+ ₹4,000/year renewal', FALSE, '["Free Domain (1 Year)","Free Hosting (1 Year)","Unlimited Pages","Responsive Design","Full SEO Package","WhatsApp Button","Contact Form","Blog Section","E-Commerce Ready","Payment Gateway","Admin Panel","1 Year Free Support"]', 3)
ON CONFLICT DO NOTHING;

-- ── Hosting Plans ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hosting_plans (
  id          SERIAL PRIMARY KEY,
  type        VARCHAR(20)    NOT NULL,
  name        VARCHAR(100)   NOT NULL,
  price       VARCHAR(30)    NOT NULL,
  price_num   DECIMAL(10,2)  DEFAULT 0,
  per         VARCHAR(20)    DEFAULT '/month',
  description TEXT,
  storage     VARCHAR(30)    DEFAULT '',
  bandwidth   VARCHAR(30)    DEFAULT '',
  websites    VARCHAR(20)    DEFAULT '',
  emails      VARCHAR(20)    DEFAULT '',
  features    JSONB,
  is_featured BOOLEAN        DEFAULT FALSE,
  is_active   BOOLEAN        DEFAULT TRUE,
  sort_order  INT            DEFAULT 0,
  created_at  TIMESTAMP      DEFAULT NOW()
);

INSERT INTO hosting_plans (type, name, price, price_num, storage, bandwidth, websites, emails, features, is_featured, sort_order) VALUES
('shared',    'Starter',    '₹99',  99,  '5 GB',     'Unlimited', '1',         '5',         '["Free SSL","99.9% Uptime","cPanel","24/7 Support"]',                       FALSE, 1),
('shared',    'Business',   '₹199', 199, '20 GB',    'Unlimited', '5',         '20',        '["Free SSL","99.9% Uptime","cPanel","Daily Backup","24/7 Support"]',         TRUE,  2),
('vps',       'VPS Basic',  '₹999', 999, '50 GB SSD','Unlimited', 'Unlimited', 'Unlimited', '["Full Root Access","Free SSL","99.99% Uptime","24/7 Support"]',             FALSE, 1),
('wordpress', 'WP Starter', '₹149', 149, '10 GB',    'Unlimited', '1',         '10',        '["1-Click WordPress","Free SSL","Auto Updates","24/7 Support"]',             TRUE,  1)
ON CONFLICT DO NOTHING;

-- ── Site Settings ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id            SERIAL PRIMARY KEY,
  setting_key   VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_group VARCHAR(50)  DEFAULT 'general',
  created_at    TIMESTAMP    DEFAULT NOW(),
  updated_at    TIMESTAMP    DEFAULT NOW()
);

INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES
('company_name',     'ShreeNova Tech',                    'general'),
('company_email',    'support@shreenovatech.in',          'general'),
('company_phone',    '+91 89870 50207',                   'general'),
('company_whatsapp', '918987050207',                      'general'),
('company_address',  'Bisanpura, Sector 58, Noida, UP',   'general'),
('company_website',  'https://shreenovatech.in',          'general'),
('logo_url',         '/logo.png',                         'general'),
('topbar_text',      '🎁 Special Offer! Get Professional Website at Just ₹9,999 INR – Limited Time Only!', 'general'),
('facebook_url',     '', 'social'),
('instagram_url',    '', 'social'),
('youtube_url',      '', 'social'),
('linkedin_url',     '', 'social'),
('upi_id',           'shreenovatech@upi', 'payment'),
('bank_holder',      'ShreeNova Tech',    'payment'),
('bank_name',        '', 'payment'),
('bank_account',     '', 'payment'),
('bank_ifsc',        '', 'payment'),
('qr_code_url',      '', 'payment'),
('meta_title',       'ShreeNova Tech – Premium Web Design & Digital Marketing', 'seo'),
('meta_description', 'Professional website development, SEO, and digital marketing services.', 'seo'),
('meta_keywords',    'web design, website development, SEO, digital marketing', 'seo'),
('google_analytics', 'G-LSXRVQFCLW', 'seo'),
('hero_title',       'Start Your Website In Just', 'hero'),
('hero_price',       '₹9,999 INR!',               'hero'),
('hero_slots',       'Only 9 Slots Available',     'hero'),
('hero_offer_text',  'Limited Time Offer',         'hero'),
('smtp_host',        'smtp.gmail.com',  'smtp'),
('smtp_port',        '587',             'smtp'),
('smtp_user',        'support@shreenovatech.in', 'smtp'),
('smtp_pass',        '', 'smtp'),
('smtp_from_name',   'ShreeNova Tech', 'smtp')
ON CONFLICT (setting_key) DO NOTHING;

-- ── FAQs ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id         SERIAL PRIMARY KEY,
  category   VARCHAR(50) DEFAULT 'general',
  question   TEXT        NOT NULL,
  answer     TEXT        NOT NULL,
  sort_order INT         DEFAULT 0,
  is_active  BOOLEAN     DEFAULT TRUE,
  created_at TIMESTAMP   DEFAULT NOW()
);

INSERT INTO faqs (category, question, answer, sort_order) VALUES
('general', 'How long does it take to build a website?',  'We typically deliver within 5–10 business days after receiving all required details and advance payment.', 1),
('general', 'Do you provide domain and hosting?',         'Yes! All packages include 1 Year Free Domain and 1 Year Free Hosting.', 2),
('general', 'Can I update my website easily?',            'Absolutely. We build with easy-to-use CMS so you can update content anytime.', 3),
('general', 'What is the payment process?',               'We require 50% advance to book your slot. Remaining 50% before the website goes live.', 4)
ON CONFLICT DO NOTHING;

-- ── Testimonials ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  role       VARCHAR(100) DEFAULT '',
  initials   VARCHAR(5)   DEFAULT '',
  rating     SMALLINT     DEFAULT 5,
  quote      TEXT         NOT NULL,
  sort_order INT          DEFAULT 0,
  is_active  BOOLEAN      DEFAULT TRUE,
  created_at TIMESTAMP    DEFAULT NOW()
);

INSERT INTO testimonials (name, role, initials, rating, quote, sort_order) VALUES
('Rahul Sharma', 'Business Owner',   'RS', 5, 'ShreeNova Tech delivered an amazing website within 7 days. Highly recommended!', 1),
('Priya Singh',  'E-Commerce Owner', 'PS', 5, 'Our online store sales increased by 300% after the new website. Excellent work!', 2),
('Amit Kumar',   'Restaurant Owner', 'AK', 5, 'Professional team, great support, and beautiful design. Worth every rupee!',    3)
ON CONFLICT DO NOTHING;

-- ── Visitors ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visitors (
  id         SERIAL PRIMARY KEY,
  ip_address VARCHAR(45)  DEFAULT '',
  page       VARCHAR(500) DEFAULT '/',
  user_agent TEXT,
  referrer   VARCHAR(500) DEFAULT '',
  visit_date DATE         DEFAULT CURRENT_DATE,
  created_at TIMESTAMP    DEFAULT NOW()
);

-- ── Activity Log ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id         SERIAL PRIMARY KEY,
  admin_id   INT          DEFAULT NULL,
  action     VARCHAR(100) NOT NULL,
  module     VARCHAR(50)  DEFAULT '',
  record_id  INT          DEFAULT NULL,
  details    TEXT,
  ip_address VARCHAR(45)  DEFAULT '',
  created_at TIMESTAMP    DEFAULT NOW()
);

-- ── Notifications ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         SERIAL PRIMARY KEY,
  type       VARCHAR(50)  DEFAULT 'info',
  title      VARCHAR(200) NOT NULL,
  message    TEXT,
  link       VARCHAR(500) DEFAULT '',
  is_read    BOOLEAN      DEFAULT FALSE,
  created_at TIMESTAMP    DEFAULT NOW()
);

-- ── Newsletter ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(100) NOT NULL UNIQUE,
  is_active  BOOLEAN      DEFAULT TRUE,
  created_at TIMESTAMP    DEFAULT NOW()
);

-- ── Blogs ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blogs (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  slug       VARCHAR(200) DEFAULT '',
  content    TEXT         NOT NULL,
  excerpt    TEXT,
  image_url  VARCHAR(500) DEFAULT '',
  category   VARCHAR(50)  DEFAULT 'general',
  tags       VARCHAR(500) DEFAULT '',
  is_active  BOOLEAN      DEFAULT TRUE,
  created_at TIMESTAMP    DEFAULT NOW(),
  updated_at TIMESTAMP    DEFAULT NOW()
);

-- ── Media Files ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_files (
  id          SERIAL PRIMARY KEY,
  filename    VARCHAR(255) NOT NULL,
  file_url    VARCHAR(500) NOT NULL,
  folder      VARCHAR(50)  DEFAULT 'general',
  file_size   INT          DEFAULT 0,
  mime_type   VARCHAR(100) DEFAULT '',
  uploaded_by INT          DEFAULT NULL,
  created_at  TIMESTAMP    DEFAULT NOW()
);
