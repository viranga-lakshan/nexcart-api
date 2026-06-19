# NexCart API

Production-style e-commerce backend built with Node.js, Express, Prisma, PostgreSQL, JWT authentication, refresh tokens, and Zod validation.

## Architecture

```text
Routes -> Controllers -> Services -> Repositories -> Database
```

Controllers stay thin, services own business workflows, repositories isolate Prisma queries, and middleware handles validation, auth, RBAC, rate limiting, and errors.

## Implemented First Slice

- Express app bootstrap and versioned `/api/v1` routing
- Helmet, CORS, cookie parsing, JSON parsing, and rate limiting
- Centralized success and error response structure
- Zod request validation
- Prisma schema for users, addresses, products, categories, carts, orders, order items, and refresh tokens
- Auth module with register, login, refresh token rotation, logout, logout all devices, forgot password, and reset password
- Users module with profile read/update and address CRUD
- Categories module with public reads and admin-only CRUD
- Products module with public browsing, seller/admin CRUD, pagination, filtering, sorting, and search
- Cart module with add item, update quantity, remove item, clear cart, stock checks, and cart totals
- Orders module with transactional checkout, inventory decrement, cart clearing, history, and status tracking
- Admin module with user role management, product moderation, and order status management
- Swagger UI at `/api/docs`
- Dockerfile, Docker Compose, `.env.example`, ESLint, and Prettier

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Set `DATABASE_URL` to your Neon PostgreSQL connection string before running migrations.

## Sample Data

Seed the database with demo users, categories, products, carts, and orders:

```bash
npm run prisma:seed
```

All demo accounts use the password `Password123!`:

| Email | Role |
| --- | --- |
| `admin@nexcart.dev` | ADMIN |
| `seller@nexcart.dev` | SELLER |
| `maya@nexcart.dev` | SELLER |
| `user@nexcart.dev` | USER |
| `jordan@nexcart.dev` | USER |

The seed script clears existing data before inserting fresh sample records.

Each product includes 3 curated Unsplash images. API responses also expose `imageUrl` (primary image) alongside the full `images` gallery array.

## Key Endpoints

- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/logout-all`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `GET /api/v1/users/me/addresses`
- `POST /api/v1/users/me/addresses`
- `PATCH /api/v1/users/me/addresses/:addressId`
- `DELETE /api/v1/users/me/addresses/:addressId`
- `GET /api/v1/categories`
- `POST /api/v1/categories`
- `PATCH /api/v1/categories/:categoryId`
- `DELETE /api/v1/categories/:categoryId`
- `GET /api/v1/products`
- `GET /api/v1/products/:productId`
- `GET /api/v1/products/me/listings`
- `POST /api/v1/products`
- `PATCH /api/v1/products/:productId`
- `DELETE /api/v1/products/:productId`
- `GET /api/v1/cart`
- `POST /api/v1/cart/items`
- `PATCH /api/v1/cart/items/:productId`
- `DELETE /api/v1/cart/items/:productId`
- `DELETE /api/v1/cart`
- `GET /api/v1/orders`
- `POST /api/v1/orders`
- `GET /api/v1/orders/:orderId`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/:userId`
- `PATCH /api/v1/admin/users/:userId/role`
- `GET /api/v1/admin/products`
- `GET /api/v1/admin/products/:productId`
- `PATCH /api/v1/admin/products/:productId`
- `GET /api/v1/admin/orders`
- `GET /api/v1/admin/orders/:orderId`
- `PATCH /api/v1/admin/orders/:orderId/status`

## Interview Notes

Refresh tokens are stored as SHA-256 hashes, so leaked database rows do not expose usable tokens. Refresh token rotation revokes the old token every time a new access token is issued, reducing replay risk.

The layered structure keeps the codebase easy to test and explain. Address and product ownership are enforced in the service layer before updates and deletes, so users cannot modify resources they do not own.

Product deletes are soft deletes by setting `isActive` to `false`. This preserves historical order integrity later, because past orders should not lose references to deleted products.

Cart writes validate active product availability and stock before changing quantities. This keeps the cart from becoming a place where invalid order state quietly accumulates.

Order placement runs inside a database transaction: it validates the cart, creates the order and order items, decrements product stock, and clears the cart together. If any step fails, the database rolls the whole checkout back.

Admin routes are protected with middleware-based RBAC and require the `ADMIN` role. The admin role update flow also prevents an admin from accidentally removing their own admin access.

## Deployment

### Local development

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Or with Docker + local Postgres: `docker compose up --build`

### AWS EC2 (CI/CD)

Push to `main` runs lint and deploys to EC2 via GitHub Actions.

- **CI:** `.github/workflows/ci.yml` — lint on every push/PR
- **Deploy:** `.github/workflows/deploy.yml` — SSH deploy on push to `main`
- **Production compose:** `docker-compose.prod.yml` (API only, Neon via `.env` on server)

Full setup (EC2, GitHub Secrets, local vs production): **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**

Required GitHub Secrets: `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`, `EC2_APP_DIR`

## Next Features

1. Add automated tests for auth, checkout, and RBAC.
2. Add S3 uploads for seller product images.
3. Add stricter rate limits on auth endpoints.
