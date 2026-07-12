const multer = require('multer');
const path   = require('path');

// Vercel pe disk storage nahi hoti — memory storage use karo
// Files Cloudinary ya kisi aur service pe upload karo
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.docx', '.svg', '.webp'];
  const ext     = path.extname(file.originalname).toLowerCase();
  cb(null, allowed.includes(ext));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
});

module.exports = upload;
