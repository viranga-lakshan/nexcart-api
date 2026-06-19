const env = require('../config/env');

const buildImageUrl = (photoId, options = {}) => {
  const { width = 900, height, quality = 80 } = options;
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    w: String(width),
    q: String(quality),
  });

  if (height) {
    params.set('h', String(height));
  }

  return `https://images.unsplash.com/photo-${photoId}?${params.toString()}`;
};

const toUploadPath = (value) => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  if (value.startsWith('/uploads/')) {
    return value;
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      const { pathname } = new URL(value);

      if (pathname.startsWith('/uploads/')) {
        return pathname;
      }
    } catch {
      return null;
    }
  }

  return null;
};

/** Turn /uploads/... into a full URL when PUBLIC_API_URL is configured. */
const resolveMediaUrl = (path) => {
  if (!path || typeof path !== 'string') {
    return path ?? null;
  }

  const uploadPath = toUploadPath(path);

  if (uploadPath && env.PUBLIC_API_URL) {
    return `${env.PUBLIC_API_URL.replace(/\/$/, '')}${uploadPath}`;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/') && env.PUBLIC_API_URL) {
    return `${env.PUBLIC_API_URL.replace(/\/$/, '')}${path}`;
  }

  return path;
};

const withProductMedia = (product) => {
  const images = (product.images ?? []).map((image) => resolveMediaUrl(image));

  return {
    ...product,
    images,
    imageUrl: images[0] ?? null,
  };
};

module.exports = {
  buildImageUrl,
  resolveMediaUrl,
  withProductMedia,
};
