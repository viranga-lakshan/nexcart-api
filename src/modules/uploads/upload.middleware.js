const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const ApiError = require('../../utils/ApiError');

const uploadsDir = path.join(process.cwd(), 'uploads', 'products');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

const uploadProductImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new ApiError(400, 'Only JPEG, PNG, WebP, and GIF images are allowed'));
    }

    return cb(null, true);
  },
}).single('image');

const handleProductImageUpload = (req, res, next) => {
  uploadProductImage(req, res, (error) => {
    if (error instanceof ApiError) {
      return next(error);
    }

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, 'Image must be 5 MB or smaller'));
      }

      return next(new ApiError(400, error.message));
    }

    if (error) {
      return next(error);
    }

    return next();
  });
};

module.exports = {
  handleProductImageUpload,
};
