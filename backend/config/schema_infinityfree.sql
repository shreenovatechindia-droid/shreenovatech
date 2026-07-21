-- ============================================================
-- ShreeNova Tech - InfinityFree Compatible Schema
-- Database: if0_42430252_shreenovatech
-- NOTE: CREATE DATABASE aur USE hata diya gaya hai
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(100),
  role          ENUM('super_admin','admin','editor','support') DEFAULT 'admin',
  is_active     TINYINT(1) DEFAULT 1,
  remember_token VARCHAR(255) DEFAULT NULL,
  reset_token   VARCHAR(255) DEFAULT NULL,
  reset_expires DATETIME DEFAULT NULL,
  last_login    DATETIME DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB;

INSERT INTO admin_users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@shreenovatech.in', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super Admin', 'super_admin');

CREATE TABLE IF NOT EXISTS activity_log (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  admin_id    INT,
  action      VARCHAR(100) NOT NULL,
  module      VARCHAR(50),
  record_id   INT DEFAULT NULL,
  details     TEXT,
  ip_address  VARCHAR(45),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_admin (admin_id),
  INDEX idx_module (module),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS site_settings (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  setting_key   VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_group VARCHAR(50) DEFAULT 'general',
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (setting_key),
  INDEX idx_group (setting_group)
) ENGINE=InnoDB;

INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES
('company_name',    'ShreeNova Tech',                    'general'),
('company_email',   'support@shreenovatech.in',          'general'),
('company_phone',   '+91 89870 50207',                   'general'),
('company_whatsapp','918987050207',                      'general'),
('company_address', 'Bisanpura, Sector 58, Noida, UP 201301', 'general'),
('company_website', 'www.shreenovatech.in',              'general'),
('logo_url',        '/logo.png',                         'general'),
('favicon_url',     '/favicon.svg',                      'general'),
('hero_title',      'Start Your Website In Just',        'hero'),
('hero_price',      '₹9,999 INR!',                       'hero'),
('hero_slots',      'Only 9 Slots Available',            'hero'),
('hero_offer_text', 'Limited Time Offer',                'hero'),
('topbar_text',     '🎁 Special Offer! Get Professional Website at Just ₹9,999 INR – Limited Time Only!', 'general'),
('bank_holder',     'ShreeNova Tech',                    'payment'),
('bank_name',       'State Bank of India',               'payment'),
('bank_account',    'XXXX XXXX XXXX',                    'payment'),
('bank_ifsc',       'SBIN0XXXXXX',                       'payment'),
('bank_branch',     'Main Branch',                       'payment'),
('upi_id',          'shreenovatech@upi',                 'payment'),
('qr_code_url',     '',                                  'payment'),
('facebook_url',    'https://www.facebook.com/share/18xY2ZRtuc/', 'social'),
('instagram_url',   'https://www.instagram.com/shreenovatech_official', 'social'),
('youtube_url',     'https://youtube.com/@shreenovatechofficial', 'social'),
('linkedin_url',    'https://www.linkedin.com/company/shreenovatech', 'social'),
('meta_title',      'ShreeNova Tech - Professional Website Development', 'seo'),
('meta_description','ShreeNova Tech offers premium website development, hosting, SEO and digital marketing services.', 'seo'),
('meta_keywords',   'website development, web hosting, SEO, digital marketing, Noida', 'seo'),
('google_analytics','',                                  'seo'),
('smtp_host',       'smtp.gmail.com',                    'smtp'),
('smtp_port',       '587',                               'smtp'),
('smtp_user',       'support@shreenovatech.in',          'smtp'),
('smtp_pass',       '',                                  'smtp'),
('smtp_from_name',  'ShreeNova Tech',                    'smtp');

CREATE TABLE IF NOT EXISTS site_stats (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  stat_key   VARCHAR(50) UNIQUE NOT NULL,
  num_value  DECIMAL(10,1) NOT NULL,
  suffix     VARCHAR(10),
  label      VARCHAR(50) NOT NULL,
  sort_order INT DEFAULT 0
) ENGINE=InnoDB;

INSERT INTO site_stats (stat_key, num_value, suffix, label, sort_order) VALUES
('happy_customers', 10000, ' +', 'Happy Customers', 1),
('uptime',          99.9,  '%',  'Uptime Record',   2),
('support',         24,    '*7', 'Contact Support', 3),
('rating',          4.9,   '/5', 'Average Rating',  4);

CREATE TABLE IF NOT EXISTS pricing_plans (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  badge       VARCHAR(20) NOT NULL,
  badge_class VARCHAR(30),
  name        VARCHAR(60) NOT NULL,
  description TEXT,
  price       VARCHAR(20) NOT NULL,
  price_num   INT NOT NULL,
  renewal     VARCHAR(100),
  is_featured TINYINT(1) DEFAULT 0,
  features    JSON,
  sort_order  INT DEFAULT 0,
  is_active   TINYINT(1) DEFAULT 1,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO pricing_plans (badge, badge_class, name, description, price, price_num, renewal, is_featured, features, sort_order) VALUES
('SILVER','badge-silver','Silver Package','Perfect for Beginners & simple blog sites.','₹9,999',9999,'Renewal After 1 Year Only ₹2500',0,'["1 Year Free Domain","1 Year Free Hosting","Up to 5 Pages","2 Business Emails","SSL Security","Mobile / Friendly Design","Call / Chat Button","Basic SEO Setup","Basic Speed Optimization","Basic Support","Delivery Time 3-5 Days","Payment & Shipping Integration"]',1),
('GOLDEN','badge-gold','Golden Package','Perfect for startups & e-commerce sites.','₹14,999',14999,'Renewal After 1 Year Only ₹2500',1,'["1 Year Free Domain","1 Year Free Hosting","Up to 5 to 10 Pages","5 Business Emails","SSL Security","Mobile Friendly Design","Call / Chat Button","Advanced SEO Setup","Advanced Speed Optimization","Advanced Support","Delivery Time 5-7 Days","Payment & Shipping Integration"]',2),
('DIAMOND','badge-diamond','Diamond Package','Perfect for Advance & Customized sites.','₹19,999',19999,'Renewal After 1 Year Only ₹2500',0,'["1 Year Free Domain","1 Year Free Hosting","Up to 10 to 15 Pages","Unlimited Business Emails","SSL Security","Mobile Friendly Design","Call / Chat Button","Premium SEO Setup","Premium Speed Optimization","Premium Support","Delivery Time 7-10 Days","Payment & Shipping Integration"]',3);

CREATE TABLE IF NOT EXISTS portfolio (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(100) NOT NULL,
  category        VARCHAR(50),
  badge           VARCHAR(100),
  industry        VARCHAR(50),
  description     TEXT,
  features        JSON,
  tech            JSON,
  image_url       VARCHAR(300),
  live_url        VARCHAR(300),
  github_url      VARCHAR(300),
  client_name     VARCHAR(100),
  completion_date DATE,
  is_featured     TINYINT(1) DEFAULT 0,
  sort_order      INT DEFAULT 0,
  is_active       TINYINT(1) DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_active (is_active),
  INDEX idx_featured (is_featured)
) ENGINE=InnoDB;

INSERT INTO portfolio (title, category, badge, industry, description, features, tech, image_url, sort_order) VALUES
('Luxury Way Jewellery','E-Commerce','Luxury Jewellery E-Commerce','Jewellery','Premium online jewellery store.','["Premium Dark UI","Product Catalogue","Wishlist","Shopping Cart","Secure Checkout","Responsive Design"]','["HTML5","CSS3","Bootstrap","JavaScript","React"]','/p1.jpg',1),
('UrbanNest Properties','Websites','Real Estate Website','Real Estate','Modern real estate platform.','["Property Search","Featured Properties","Contact Agent","Responsive Design"]','["React","Bootstrap","Node.js"]','/p2.jpg',2),
('MediCare Plus','Websites','Hospital Website','Healthcare','Professional healthcare website.','["Appointment Booking","Doctor Profiles","Emergency Services","Responsive Design"]','["React","Bootstrap","PHP"]','/p3.jpg',3),
('StyleHub Fashion','E-Commerce','Fashion E-Commerce','Fashion','Stylish online fashion store.','["Fashion Catalogue","Shopping Cart","Product Filter","Responsive Design"]','["React","Bootstrap","Node.js"]','/p4.jpg',4),
('Digix Agency','Websites','Digital Marketing Website','Digital Marketing','Creative digital marketing website.','["SEO Services","Branding","Google Ads","Analytics"]','["React","Bootstrap"]','/p5.jpg',5),
('EduLearn Platform','Websites','Education Website','Education','Online learning portal.','["Online Courses","Student Dashboard","Certificate","Responsive Design"]','["React","Bootstrap"]','/p6.jpg',6),
('FoodExpress','Landing Pages','Restaurant Website','Food & Beverage','Modern restaurant website.','["Online Ordering","Digital Menu","Reservations","Responsive Design"]','["React","Bootstrap"]','/p7.jpg',7),
('Travel Explorer','SEO Projects','Travel Agency Website','Travel & Tourism','Tour packages and travel booking.','["Tour Packages","Destination Gallery","Travel Booking","Enquiry Form"]','["React","Bootstrap","Node.js"]','/p8.jpg',8),
('FinancePro','Branding','Finance Website','Finance','Investment consulting website.','["Investment Consulting","Loan Services","Insurance Info","Enquiry Management"]','["React","Bootstrap"]','/p9.jpg',9),
('ShreeNova Tech','E-Commerce','Corporate Business Website','Information Technology','Premium IT company website.','["Website Development","Mobile App Dev","Cloud Hosting","SEO Services","Digital Marketing"]','["React","Bootstrap","Node.js","PHP"]','/p10.jpg',10);

CREATE TABLE IF NOT EXISTS testimonials (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  role       VARCHAR(100),
  initials   VARCHAR(5),
  rating     TINYINT DEFAULT 5,
  quote      TEXT NOT NULL,
  is_active  TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_active (is_active)
) ENGINE=InnoDB;

INSERT INTO testimonials (name, role, initials, rating, quote, sort_order) VALUES
('Ravi Sharma','Business Owner','RS',5,'"ShreeNova Tech delivered exactly what they promised. My website looks perfect on all devices."',1),
('Priya Singh','Entrepreneur','PS',5,'"Great support and amazing designs. I am very happy with the results."',2),
('Amit Verma','CEO, Startup','AV',5,'"Affordable pricing with premium quality. Best decision for my business."',3);

CREATE TABLE IF NOT EXISTS faqs (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  category   VARCHAR(50) DEFAULT 'general',
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active  TINYINT(1) DEFAULT 1,
  INDEX idx_category (category),
  INDEX idx_active (is_active)
) ENGINE=InnoDB;

INSERT INTO faqs (category, question, answer, sort_order) VALUES
('general','How long does it take to build a website?','We typically deliver within 5 to 10 business days after receiving all required details.',1),
('general','Do you provide domain and hosting?','Yes! All packages include 1 Year Free Domain and 1 Year Free Hosting.',2),
('general','What is the payment process?','We require 50% advance payment to book your slot. Remaining 50% before go-live.',3);

CREATE TABLE IF NOT EXISTS bookings (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  ref_id       VARCHAR(25) UNIQUE NOT NULL,
  full_name    VARCHAR(100) NOT NULL,
  mobile       VARCHAR(15) NOT NULL,
  whatsapp     VARCHAR(15),
  email        VARCHAR(100) NOT NULL,
  company      VARCHAR(100),
  business     VARCHAR(100),
  website      VARCHAR(200),
  city         VARCHAR(50),
  state        VARCHAR(50),
  country      VARCHAR(50) DEFAULT 'India',
  project_type VARCHAR(100),
  budget       VARCHAR(50),
  timeline     VARCHAR(50),
  description  TEXT,
  services     JSON,
  logo_url     VARCHAR(300),
  images_url   VARCHAR(300),
  docs_url     VARCHAR(300),
  status       ENUM('new','contacted','in_progress','completed','cancelled') DEFAULT 'new',
  admin_notes  TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_email (email),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  ref_id          VARCHAR(25) UNIQUE NOT NULL,
  booking_ref     VARCHAR(25) DEFAULT NULL,
  full_name       VARCHAR(100) NOT NULL,
  mobile          VARCHAR(15) NOT NULL,
  whatsapp        VARCHAR(15),
  email           VARCHAR(100) NOT NULL,
  company         VARCHAR(100),
  gst             VARCHAR(20),
  address         TEXT,
  city            VARCHAR(50),
  state           VARCHAR(50),
  country         VARCHAR(50) DEFAULT 'India',
  pincode         VARCHAR(10),
  package_key     ENUM('silver','golden','diamond') NOT NULL,
  package_name    VARCHAR(60),
  amount          DECIMAL(10,2),
  gst_amount      DECIMAL(10,2),
  total_amount    DECIMAL(10,2),
  pay_method      VARCHAR(30),
  transaction_id  VARCHAR(100),
  screenshot_url  VARCHAR(300),
  status          ENUM('pending','verified','rejected') DEFAULT 'pending',
  admin_notes     TEXT,
  verified_by     INT DEFAULT NULL,
  verified_at     DATETIME DEFAULT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (verified_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_email (email),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contacts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  phone      VARCHAR(15),
  message    TEXT NOT NULL,
  status     ENUM('new','read','replied') DEFAULT 'new',
  reply_text TEXT,
  replied_by INT DEFAULT NULL,
  replied_at DATETIME DEFAULT NULL,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (replied_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(100) UNIQUE NOT NULL,
  is_active     TINYINT(1) DEFAULT 1,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blog_categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) UNIQUE NOT NULL,
  is_active  TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO blog_categories (name, slug) VALUES
('Website Development','website-development'),
('Digital Marketing','digital-marketing'),
('SEO Tips','seo-tips'),
('Hosting','hosting'),
('Business Tips','business-tips');

CREATE TABLE IF NOT EXISTS blog_posts (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  category_id   INT,
  title         VARCHAR(200) NOT NULL,
  slug          VARCHAR(200) UNIQUE NOT NULL,
  excerpt       TEXT,
  content       LONGTEXT,
  image_url     VARCHAR(300),
  tags          JSON,
  meta_title    VARCHAR(200),
  meta_desc     TEXT,
  meta_keywords VARCHAR(300),
  author_id     INT,
  status        ENUM('draft','published','archived') DEFAULT 'draft',
  views         INT DEFAULT 0,
  published_at  DATETIME DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hosting_plans (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  type        ENUM('shared','cloud','vps','wordpress','dedicated') NOT NULL,
  name        VARCHAR(60) NOT NULL,
  price       VARCHAR(20) NOT NULL,
  price_num   DECIMAL(10,2),
  per         VARCHAR(20) DEFAULT '/month',
  description TEXT,
  storage     VARCHAR(30),
  bandwidth   VARCHAR(30),
  websites    VARCHAR(20),
  emails      VARCHAR(20),
  features    JSON,
  is_featured TINYINT(1) DEFAULT 0,
  is_active   TINYINT(1) DEFAULT 1,
  sort_order  INT DEFAULT 0,
  INDEX idx_type (type)
) ENGINE=InnoDB;

INSERT INTO hosting_plans (type, name, price, price_num, per, description, storage, bandwidth, websites, emails, features, is_featured, sort_order) VALUES
('shared','Starter','₹99',99,'/month','Perfect for personal websites.','5 GB SSD','Unmetered','1','2','["Free SSL","99.9% Uptime","Basic Support","cPanel Access"]',0,1),
('shared','Business','₹199',199,'/month','Ideal for small business websites.','20 GB SSD','Unmetered','5','10','["Free SSL","Free Domain","Priority Support","Daily Backup"]',1,2),
('shared','Enterprise','₹399',399,'/month','For high traffic websites.','50 GB SSD','Unmetered','Unlimited','Unlimited','["Free SSL","Free Domain","24/7 Support","Daily Backup","Free Migration"]',0,3);

CREATE TABLE IF NOT EXISTS media_files (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  filename      VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_path     VARCHAR(500) NOT NULL,
  file_url      VARCHAR(500) NOT NULL,
  file_type     VARCHAR(50),
  file_size     INT,
  folder        VARCHAR(100) DEFAULT 'general',
  uploaded_by   INT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_folder (folder)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS seo_pages (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  page_slug     VARCHAR(100) UNIQUE NOT NULL,
  page_name     VARCHAR(100),
  meta_title    VARCHAR(200),
  meta_desc     TEXT,
  meta_keywords VARCHAR(300),
  og_title      VARCHAR(200),
  og_desc       TEXT,
  og_image      VARCHAR(300),
  robots        VARCHAR(50) DEFAULT 'index,follow',
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (page_slug)
) ENGINE=InnoDB;

INSERT INTO seo_pages (page_slug, page_name, meta_title, meta_desc, meta_keywords) VALUES
('home','Home','ShreeNova Tech - Professional Website Development Starting Rs.9,999','ShreeNova Tech offers premium website development, hosting, SEO and digital marketing services.','website development, web hosting, SEO, digital marketing, Noida'),
('hosting','Hosting','Web Hosting Services - ShreeNova Tech','Reliable web hosting with 99.9% uptime, free SSL and 24/7 support.','web hosting, shared hosting, cloud hosting, VPS hosting'),
('website-development','Website Development','Professional Website Development - ShreeNova Tech','We build modern, fast and SEO-friendly websites starting at Rs.9,999.','website development, business website, ecommerce website');

CREATE TABLE IF NOT EXISTS visitors (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45),
  page       VARCHAR(200),
  user_agent TEXT,
  referrer   VARCHAR(500),
  visit_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (visit_date),
  INDEX idx_ip (ip_address)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  type       VARCHAR(50) DEFAULT 'booking',
  title      VARCHAR(200) NOT NULL,
  message    TEXT,
  ref_id     VARCHAR(25),
  record_id  INT DEFAULT NULL,
  is_read    TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_read (is_read),
  INDEX idx_type (type)
) ENGINE=InnoDB;
