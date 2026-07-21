require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./src/config/db');
const { AdminUser } = require('./src/models');

async function seed() {
  await connect();

  const existing = await AdminUser.findOne({ email: 'admin@shreenovatech.in' });
  if (existing) {
    console.log('✅ Admin already exists — email: admin@shreenovatech.in');
    process.exit(0);
  }

  const password_hash = await bcrypt.hash('Admin@123', 12);
  await AdminUser.create({
    username:      'admin',
    email:         'admin@shreenovatech.in',
    password_hash,
    full_name:     'Super Admin',
    role:          'super_admin',
    is_active:     true,
  });

  console.log('✅ Admin created!');
  console.log('   Email:    admin@shreenovatech.in');
  console.log('   Password: Admin@123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
