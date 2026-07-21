const { mongoose } = require('../config/db');
const { Schema, model } = mongoose;

// ── Contact ──────────────────────────────────────────
const contactSchema = new Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       String,
  message:     { type: String, required: true },
  subject:     String,
  status:      { type: String, enum: ['new','read','replied'], default: 'new' },
  reply_text:  String,
  replied_by:  String,
  replied_at:  Date,
  ip_address:  String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ── Booking ──────────────────────────────────────────
const bookingSchema = new Schema({
  ref_id:       { type: String, unique: true },
  full_name:    { type: String, required: true },
  mobile:       { type: String, required: true },
  whatsapp:     String,
  email:        { type: String, required: true },
  company:      String,
  business:     String,
  website:      String,
  city:         String,
  state:        String,
  country:      { type: String, default: 'India' },
  project_type: String,
  budget:       String,
  timeline:     String,
  description:  String,
  services:     [String],
  logo_url:     String,
  images_url:   String,
  docs_url:     String,
  status:       { type: String, enum: ['new','contacted','in_progress','completed','cancelled'], default: 'new' },
  admin_notes:  String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ── Payment ──────────────────────────────────────────
const paymentSchema = new Schema({
  ref_id:         { type: String, unique: true },
  full_name:      { type: String, required: true },
  mobile:         { type: String, required: true },
  whatsapp:       String,
  email:          { type: String, required: true },
  company:        String,
  gst:            String,
  address:        String,
  city:           String,
  state:          String,
  country:        { type: String, default: 'India' },
  pincode:        String,
  package_key:    String,
  package_name:   String,
  amount:         Number,
  gst_amount:     Number,
  total_amount:   Number,
  pay_method:     String,
  transaction_id: String,
  screenshot_url: String,
  status:              { type: String, enum: ['pending','verified','rejected','approved'], default: 'pending' },
  admin_notes:         String,
  verified_by:         String,
  verified_at:         Date,
  payment_verified:    { type: Boolean, default: false },
  approved_at:         Date,
  approved_by_ip:      String,
  approved_by_browser: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ── Admin User ───────────────────────────────────────
const adminUserSchema = new Schema({
  username:       { type: String, required: true, unique: true },
  email:          { type: String, required: true, unique: true },
  password_hash:  { type: String, required: true },
  full_name:      String,
  role:           { type: String, enum: ['super_admin','admin','editor','support'], default: 'admin' },
  is_active:      { type: Boolean, default: true },
  last_login:     Date,
  remember_token: String,
  reset_token:    String,
  reset_expires:  Date,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ── Pricing Plan ─────────────────────────────────────
const pricingSchema = new Schema({
  badge:       String,
  badge_class: String,
  name:        { type: String, required: true },
  description: String,
  price:       String,
  price_num:   Number,
  renewal:     String,
  is_featured: { type: Boolean, default: false },
  features:    [String],
  sort_order:  { type: Number, default: 0 },
  is_active:   { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ── Portfolio ────────────────────────────────────────
const portfolioSchema = new Schema({
  title:           { type: String, required: true },
  category:        { type: String, required: true },
  badge:           String,
  industry:        String,
  description:     String,
  features:        [String],
  tech:            [String],
  image_url:       String,
  live_url:        String,
  github_url:      String,
  client_name:     String,
  completion_date: Date,
  is_featured:     { type: Boolean, default: false },
  sort_order:      { type: Number, default: 0 },
  is_active:       { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ── Hosting Plan ─────────────────────────────────────
const hostingSchema = new Schema({
  type:        String,
  name:        { type: String, required: true },
  price:       String,
  price_num:   Number,
  per:         String,
  description: String,
  storage:     String,
  bandwidth:   String,
  websites:    String,
  emails:      String,
  features:    [String],
  is_featured: { type: Boolean, default: false },
  is_active:   { type: Boolean, default: true },
  sort_order:  { type: Number, default: 0 },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ── Site Settings ────────────────────────────────────
const settingSchema = new Schema({
  setting_key:   { type: String, required: true, unique: true },
  setting_value: String,
  setting_group: String,
}, { timestamps: false });

// ── Site Stats ───────────────────────────────────────
const statSchema = new Schema({
  stat_key:   { type: String, unique: true },
  num_value:  Number,
  suffix:     String,
  label:      String,
  sort_order: { type: Number, default: 0 },
}, { timestamps: false });

// ── Testimonial ──────────────────────────────────────
const testimonialSchema = new Schema({
  name:       String,
  role:       String,
  initials:   String,
  rating:     { type: Number, default: 5 },
  quote:      String,
  is_active:  { type: Boolean, default: true },
  sort_order: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ── FAQ ──────────────────────────────────────────────
const faqSchema = new Schema({
  question:   String,
  answer:     String,
  category:   String,
  sort_order: { type: Number, default: 0 },
  is_active:  { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ── Newsletter ───────────────────────────────────────
const newsletterSchema = new Schema({
  email:     { type: String, required: true, unique: true },
  is_active: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ── Visitor ──────────────────────────────────────────
const visitorSchema = new Schema({
  ip_address: String,
  page:       String,
  user_agent: String,
  referrer:   String,
  visit_date: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ── Activity Log ─────────────────────────────────────
const activitySchema = new Schema({
  admin_id:  String,
  action:    String,
  module:    String,
  record_id: String,
  details:   String,
  ip_address:String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ── Blog Category ────────────────────────────────────
const blogCategorySchema = new Schema({
  name:      { type: String, required: true },
  slug:      { type: String, unique: true, required: true },
  is_active: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

// ── Blog ─────────────────────────────────────────────
const blogSchema = new Schema({
  category_id:   { type: Schema.Types.ObjectId, ref: 'BlogCategory' },
  title:         { type: String, required: true },
  slug:          { type: String, unique: true, required: true },
  excerpt:       String,
  content:       String,
  image_url:     String,
  tags:          [String],
  meta_title:    String,
  meta_desc:     String,
  meta_keywords: String,
  author_id:     { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  status:        { type: String, enum: ['draft','published','archived'], default: 'draft' },
  views:         { type: Number, default: 0 },
  published_at:  Date,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ── SEO ──────────────────────────────────────────────
const seoSchema = new Schema({
  page_slug:     { type: String, unique: true, required: true },
  page_name:     String,
  meta_title:    String,
  meta_desc:     String,
  meta_keywords: String,
  og_title:      String,
  og_desc:       String,
  og_image:      String,
  robots:        { type: String, default: 'index,follow' },
}, { timestamps: { createdAt: false, updatedAt: 'updated_at' } });

// ── Media ─────────────────────────────────────────────
const mediaSchema = new Schema({
  filename:      { type: String, required: true },
  original_name: String,
  file_path:     { type: String, required: true },
  file_url:      { type: String, required: true },
  file_type:     String,
  file_size:     Number,
  folder:        { type: String, default: 'general' },
  uploaded_by:   { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

// ── Notification ──────────────────────────────────────
const notificationSchema = new Schema({
  type:      { type: String, default: 'booking' },
  title:     { type: String, required: true },
  message:   String,
  ref_id:    String,
  record_id: String,
  is_read:   { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = {
  Contact:      model('Contact',      contactSchema),
  Booking:      model('Booking',      bookingSchema),
  Payment:      model('Payment',      paymentSchema),
  AdminUser:    model('AdminUser',    adminUserSchema),
  Pricing:      model('Pricing',      pricingSchema),
  Portfolio:    model('Portfolio',    portfolioSchema),
  Hosting:      model('Hosting',      hostingSchema),
  Setting:      model('Setting',      settingSchema),
  Stat:         model('Stat',         statSchema),
  Testimonial:  model('Testimonial',  testimonialSchema),
  Faq:          model('Faq',          faqSchema),
  Newsletter:   model('Newsletter',   newsletterSchema),
  Visitor:      model('Visitor',      visitorSchema),
  Activity:     model('Activity',     activitySchema),
  BlogCategory: model('BlogCategory', blogCategorySchema),
  Blog:         model('Blog',         blogSchema),
  Seo:          model('Seo',          seoSchema),
  Media:        model('Media',        mediaSchema),
  Notification: model('Notification', notificationSchema),
};
