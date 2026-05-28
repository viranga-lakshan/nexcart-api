/** Verified product image URLs (Unsplash) — matched to each product category. */
const image = (url) => url;

const categories = [
  {
    name: 'Audio',
    description: 'Headphones, speakers, and studio gear for everyday listening and production.',
    imageUrl: image(
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&h=800&q=80',
    ),
  },
  {
    name: 'Wearables',
    description: 'Smart watches and fitness trackers built for health, sport, and daily routines.',
    imageUrl: image(
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&h=800&q=80',
    ),
  },
  {
    name: 'Bags',
    description: 'Backpacks, duffels, and carry solutions for commute, travel, and weekend trips.',
    imageUrl: image(
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&h=800&q=80',
    ),
  },
  {
    name: 'Home Office',
    description: 'Deskside essentials including lighting, seating, and productivity accessories.',
    imageUrl: image(
      'https://images.unsplash.com/photo-1497366216543-375260948968?auto=format&fit=crop&w=1200&h=800&q=80',
    ),
  },
  {
    name: 'Gaming',
    description: 'Controllers, headsets, and peripherals tuned for responsive play sessions.',
    imageUrl: image(
      'https://images.unsplash.com/photo-1542753447-4951dd489e8b?auto=format&fit=crop&w=1200&h=800&q=80',
    ),
  },
  {
    name: 'Accessories',
    description: 'Chargers, cables, and everyday tech accessories that complete your setup.',
    imageUrl: image(
      'https://images.unsplash.com/photo-1588508077625-53a6b875ee52?auto=format&fit=crop&w=1200&h=800&q=80',
    ),
  },
  {
    name: 'Beauty',
    description: 'Skincare, cosmetics, and personal care products for everyday routines.',
    imageUrl: image(
      'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=1200&h=800&q=80',
    ),
  },
  {
    name: 'Books',
    description: 'Bestsellers, guides, and curated reads across every interest.',
    imageUrl: image(
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&h=800&q=80',
    ),
  },
  {
    name: 'Cameras',
    description: 'Cameras, lenses, and photography gear for creators and travelers.',
    imageUrl: image(
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&h=800&q=80',
    ),
  },
];

const products = [
  {
    name: 'Auraluxe Wireless Headphones',
    category: 'Audio',
    description:
      'Premium over-ear headphones with adaptive noise cancellation, 40-hour battery life, and memory-foam cushions for all-day comfort.',
    price: 129.99,
    stock: 42,
    images: [
      image(
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&h=900&q=80',
      ),
      image(
        'https://images.unsplash.com/photo-1546437370-dea6c5860a64?auto=format&fit=crop&w=900&h=900&q=80',
      ),
    ],
  },
  {
    name: 'Studio Pro Monitor Headphones',
    category: 'Audio',
    description:
      'Flat-response studio headphones with swappable ear pads, a detachable cable, and accurate sound for mixing and editing.',
    price: 89.99,
    stock: 28,
    images: [
      image(
        'https://images.unsplash.com/photo-1546437370-dea6c5860a64?auto=format&fit=crop&w=900&h=900&q=80',
      ),
      image(
        'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=900&h=900&q=80',
      ),
    ],
  },
  {
    name: 'PulseFit Smart Watch',
    category: 'Wearables',
    description:
      'Fitness-first smartwatch with GPS, sleep insights, heart-rate zones, and a bright always-on display.',
    price: 189.0,
    stock: 30,
    images: [
      image(
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&h=900&q=80',
      ),
      image(
        'https://images.unsplash.com/photo-1434494887895-59a10ad0d56a?auto=format&fit=crop&w=900&h=900&q=80',
      ),
    ],
  },
  {
    name: 'Stride Health Band',
    category: 'Wearables',
    description:
      'Lightweight health band with continuous heart-rate monitoring, step tracking, and weekly wellness summaries.',
    price: 59.99,
    stock: 64,
    images: [
      image(
        'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=900&h=900&q=80',
      ),
      image(
        'https://images.unsplash.com/photo-1551697849-4f79797b98af?auto=format&fit=crop&w=900&h=900&q=80',
      ),
    ],
  },
  {
    name: 'Nomad Commuter Pack',
    category: 'Bags',
    description:
      'Water-resistant 24L backpack with padded laptop sleeve, hidden passport pocket, and quick-access front compartment.',
    price: 89.0,
    stock: 58,
    images: [
      image(
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&h=900&q=80',
      ),
      image(
        'https://images.unsplash.com/photo-1622560847463-a833e1f88c71?auto=format&fit=crop&w=900&h=900&q=80',
      ),
    ],
  },
  {
    name: 'Weekender Travel Duffel',
    category: 'Bags',
    description:
      'Compact 45L duffel with ventilated shoe compartment, trolley sleeve, and reinforced carry handles.',
    price: 74.5,
    stock: 22,
    images: [
      image(
        'https://images.unsplash.com/photo-1547949003-979cc39c12db?auto=format&fit=crop&w=900&h=900&q=80',
      ),
      image(
        'https://images.unsplash.com/photo-1548033578-0b1c624e0cde?auto=format&fit=crop&w=900&h=900&q=80',
      ),
    ],
  },
  {
    name: 'Focus Desk Lamp',
    category: 'Home Office',
    description:
      'Adjustable LED desk lamp with warm and cool presets, touch dimming, and a stable weighted base.',
    price: 49.99,
    stock: 36,
    images: [
      image(
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&h=900&q=80',
      ),
      image(
        'https://images.unsplash.com/photo-1507473886341-13514159cef3?auto=format&fit=crop&w=900&h=900&q=80',
      ),
    ],
  },
  {
    name: 'Ergo Mesh Task Chair',
    category: 'Home Office',
    description:
      'Breathable mesh task chair with lumbar support, 4D armrests, and smooth tilt for long work sessions.',
    price: 249.0,
    stock: 12,
    images: [
      image(
        'https://images.unsplash.com/photo-1592078614919-d25736290aba?auto=format&fit=crop&w=900&h=900&q=80',
      ),
      image(
        'https://images.unsplash.com/photo-1580480057503-f86a0c625a48?auto=format&fit=crop&w=900&h=900&q=80',
      ),
    ],
  },
  {
    name: 'Apex Wireless Controller',
    category: 'Gaming',
    description:
      'Low-latency wireless controller with textured grips, rear paddles, and a rechargeable 20-hour battery.',
    price: 69.99,
    stock: 45,
    images: [
      image(
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&h=900&q=80',
      ),
      image(
        'https://images.unsplash.com/photo-1542753447-4951dd489e8b?auto=format&fit=crop&w=900&h=900&q=80',
      ),
    ],
  },
  {
    name: 'HyperSound Gaming Headset',
    category: 'Gaming',
    description:
      'Surround-sound gaming headset with detachable noise-cancelling mic and breathable memory-foam ear cups.',
    price: 99.0,
    stock: 33,
    images: [
      image(
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&h=900&q=80',
      ),
      image(
        'https://images.unsplash.com/photo-1599667850439-5b5d6def6ea5?auto=format&fit=crop&w=900&h=900&q=80',
      ),
    ],
  },
  {
    name: 'MagSafe Power Bank',
    category: 'Accessories',
    description:
      '10,000 mAh magnetic power bank with 20W fast charging, pass-through charging, and flight-safe capacity.',
    price: 39.99,
    stock: 80,
    images: [
      image(
        'https://images.unsplash.com/photo-1591293110755-36b80eb82492?auto=format&fit=crop&w=900&h=900&q=80',
      ),
      image(
        'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&h=900&q=80',
      ),
    ],
  },
  {
    name: 'Braided USB-C Cable Pack',
    category: 'Accessories',
    description:
      'Three-pack of braided USB-C cables in 1m, 1.5m, and 2m lengths with reinforced strain relief connectors.',
    price: 24.99,
    stock: 120,
    images: [
      image(
        'https://images.unsplash.com/photo-1625948515291-696fbf6b4690?auto=format&fit=crop&w=900&h=900&q=80',
      ),
      image(
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&h=900&q=80',
      ),
    ],
  },
];

module.exports = {
  categories,
  products,
};
