const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniquePrefix}${ext}`);
  },
});

const upload = multer({
  storage: multerConfig,
  limits: { fileSize: 5 * 1024 * 1024 }, // максимум 5MB
});

module.exports = upload;
