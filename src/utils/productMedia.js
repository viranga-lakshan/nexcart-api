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

const withProductMedia = (product) => ({
  ...product,
  imageUrl: product.images?.[0] ?? null,
});

module.exports = {
  buildImageUrl,
  withProductMedia,
};
