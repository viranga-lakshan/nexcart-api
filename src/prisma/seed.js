require('dotenv').config();

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const createSlug = require('../utils/slug');
const { categories, products } = require('./seedData');

const DEMO_PASSWORD = 'Password123!';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function clearDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers(hashedPassword) {
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@nexcart.dev',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+1-555-0100',
    },
  });

  const seller = await prisma.user.create({
    data: {
      name: 'Seller User',
      email: 'seller@nexcart.dev',
      password: hashedPassword,
      role: 'SELLER',
      phone: '+1-555-0101',
    },
  });

  const sellerTwo = await prisma.user.create({
    data: {
      name: 'Maya Chen',
      email: 'maya@nexcart.dev',
      password: hashedPassword,
      role: 'SELLER',
      phone: '+1-555-0102',
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Ava Johnson',
      email: 'user@nexcart.dev',
      password: hashedPassword,
      role: 'USER',
      phone: '+1-555-0103',
    },
  });

  const userTwo = await prisma.user.create({
    data: {
      name: 'Jordan Lee',
      email: 'jordan@nexcart.dev',
      password: hashedPassword,
      role: 'USER',
      phone: '+1-555-0104',
    },
  });

  return { admin, seller, sellerTwo, user, userTwo };
}

async function seedCategories() {
  const records = {};

  for (const category of categories) {
    records[category.name] = await prisma.category.create({
      data: {
        name: category.name,
        slug: createSlug(category.name),
        description: category.description,
        imageUrl: category.imageUrl ?? null,
      },
    });
  }

  return records;
}

async function seedProducts(categoryRecords, sellers) {
  const sellerIds = [sellers.seller.id, sellers.sellerTwo.id];
  const createdProducts = [];

  for (const [index, product] of products.entries()) {
    const sellerId = sellerIds[index % sellerIds.length];
    const category = categoryRecords[product.category];

    const created = await prisma.product.create({
      data: {
        sellerId,
        categoryId: category.id,
        name: product.name,
        slug: createSlug(product.name),
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
        isActive: true,
      },
    });

    createdProducts.push(created);
  }

  return createdProducts;
}

async function seedAddresses(users) {
  const homeAddress = await prisma.address.create({
    data: {
      userId: users.user.id,
      label: 'Home',
      line1: '742 Evergreen Terrace',
      line2: 'Apt 4B',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62704',
      country: 'USA',
      isDefault: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: users.user.id,
      label: 'Office',
      line1: '120 Market Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA',
      isDefault: false,
    },
  });

  await prisma.address.create({
    data: {
      userId: users.userTwo.id,
      label: 'Home',
      line1: '18 Cedar Lane',
      city: 'Austin',
      state: 'TX',
      postalCode: '73301',
      country: 'USA',
      isDefault: true,
    },
  });

  return homeAddress;
}

async function seedCart(userId, productRecords) {
  const cart = await prisma.cart.create({
    data: { userId },
  });

  await prisma.cartItem.createMany({
    data: [
      { cartId: cart.id, productId: productRecords[0].id, quantity: 1 },
      { cartId: cart.id, productId: productRecords[2].id, quantity: 2 },
    ],
  });

  return cart;
}

async function seedOrders(users, productRecords, shippingAddress) {
  const deliveredOrder = await prisma.order.create({
    data: {
      userId: users.user.id,
      status: 'DELIVERED',
      totalAmount: 218.99,
      shippingAddress: {
        label: shippingAddress.label,
        line1: shippingAddress.line1,
        line2: shippingAddress.line2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      items: {
        create: [
          {
            productId: productRecords[0].id,
            quantity: 1,
            unitPrice: productRecords[0].price,
          },
          {
            productId: productRecords[10].id,
            quantity: 2,
            unitPrice: productRecords[10].price,
          },
        ],
      },
    },
  });

  const processingOrder = await prisma.order.create({
    data: {
      userId: users.userTwo.id,
      status: 'PROCESSING',
      totalAmount: 189.0,
      shippingAddress: {
        label: 'Home',
        line1: '18 Cedar Lane',
        city: 'Austin',
        state: 'TX',
        postalCode: '73301',
        country: 'USA',
      },
      items: {
        create: [
          {
            productId: productRecords[2].id,
            quantity: 1,
            unitPrice: productRecords[2].price,
          },
        ],
      },
    },
  });

  return { deliveredOrder, processingOrder };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run the seed script.');
  }

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, saltRounds);

  console.log('Clearing existing data...');
  await clearDatabase();

  console.log('Seeding users...');
  const users = await seedUsers(hashedPassword);

  console.log('Seeding categories...');
  const categoryRecords = await seedCategories();

  console.log('Seeding products...');
  const productRecords = await seedProducts(categoryRecords, users);

  console.log('Seeding addresses...');
  const defaultAddress = await seedAddresses(users);

  console.log('Seeding cart...');
  await seedCart(users.user.id, productRecords);

  console.log('Seeding orders...');
  await seedOrders(users, productRecords, defaultAddress);

  console.log('\nSeed completed successfully.\n');
  console.log('Demo accounts (password for all):', DEMO_PASSWORD);
  console.log('- admin@nexcart.dev   (ADMIN)');
  console.log('- seller@nexcart.dev  (SELLER)');
  console.log('- maya@nexcart.dev    (SELLER)');
  console.log('- user@nexcart.dev    (USER)');
  console.log('- jordan@nexcart.dev  (USER)');
  console.log(`\nCreated ${categories.length} categories, ${productRecords.length} products, 2 orders, and 1 cart.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
