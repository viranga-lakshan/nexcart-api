# NexCart API — Deployment & CI/CD

This guide covers **local development** and **automated deploy to AWS EC2** via GitHub Actions.

---

## Overview

| Environment | How you run | Database |
|-------------|-------------|----------|
| **Local (Node)** | `npm run dev` | Neon or local Postgres via `.env` |
| **Local (Docker)** | `docker compose up` | Postgres container |
| **AWS EC2** | GitHub Actions → `docker compose -f docker-compose.prod.yml up` | Neon via `.env` on server |

**Important:** Never commit `.env`. Secrets stay on your machine (local) and on EC2 (production).

---

## Part 1 — Local development (unchanged)

### Option A — Run with Node (recommended for daily dev)

```bash
npm install
cp .env.example .env
# Edit .env — set DATABASE_URL (Neon), JWT secrets, CORS_ORIGIN
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed   # optional
npm run dev
```

API: `http://localhost:5000`

### Option B — Run with Docker (local Postgres)

```bash
cp .env.example .env
# Set DATABASE_URL=postgresql://nexcart:nexcart@postgres:5432/nexcart?schema=public
docker compose up --build
```

Uses `docker-compose.yml` (API + Postgres).

---

## Part 2 — One-time AWS EC2 setup

SSH into your EC2 instance:

```bash
ssh ec2-user@YOUR_EC2_IP
```

### 1. Install Docker (if not installed)

Amazon Linux 2023 example:

```bash
sudo yum update -y
sudo yum install -y docker git
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user
# Log out and back in so docker group applies
```

Install Docker Compose plugin (required — CI/CD uses `docker compose`):

```bash
sudo apt update
sudo apt install -y docker-compose-v2
docker compose version
```

Add your user to the docker group (optional — CI/CD uses `sudo`):

```bash
sudo usermod -aG docker ubuntu
# log out and SSH back in
```

### 2. Clone the repo on EC2

```bash
cd ~
git clone https://github.com/viranga-lakshan/nexcart-api.git
cd nexcart-api
```

### 3. Create `.env` on EC2 (only on server — never in git)

```bash
nano .env
```

Example (use your real values):

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,https://your-vercel-app.vercel.app
JWT_ACCESS_SECRET=your_long_random_access_secret_at_least_32_chars
JWT_REFRESH_SECRET=your_long_random_refresh_secret_at_least_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
REFRESH_TOKEN_COOKIE_NAME=refreshToken
PASSWORD_RESET_TOKEN_EXPIRES_MINUTES=15
```

Create uploads folder (until S3 is added):

```bash
mkdir -p uploads/products
```

### 4. First manual deploy on EC2

```bash
docker compose -f docker-compose.prod.yml up -d --build
curl http://localhost:5000/api/v1/health
```

Open port **5000** in the EC2 security group (or put Nginx in front later).

---

## Part 3 — GitHub Actions secrets

In GitHub: **Repository → Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value | Example |
|-------------|-------|---------|
| `EC2_HOST` | EC2 public IP or domain | `13.60.211.231` |
| `EC2_USER` | SSH user | `ec2-user` or `ubuntu` |
| `EC2_SSH_KEY` | Full private key (`.pem` contents) | `-----BEGIN RSA PRIVATE KEY-----...` |
| `EC2_APP_DIR` | Absolute path to repo on EC2 | `/home/ec2-user/nexcart-api` |

### EC2 SSH key for GitHub Actions

1. Use your existing `.pem` key, or create a deploy key pair.
2. Copy the **entire** private key into `EC2_SSH_KEY` (including BEGIN/END lines).
3. Ensure EC2 security group allows **SSH (22)** from GitHub Actions IPs, or `0.0.0.0/0` for testing (tighten later).

---

## Part 4 — How CI/CD works

### On every push / PR to `main`

Workflow: `.github/workflows/ci.yml`

- `npm ci`
- `npm run prisma:generate`
- `npm run lint`

### On push to `main` (after lint passes)

Workflow: `.github/workflows/deploy.yml`

1. Lint (same as CI)
2. SSH to EC2
3. `git fetch` + `git reset --hard origin/main`
4. `docker compose -f docker-compose.prod.yml up -d --build`
5. Prune old Docker images
6. Hit `/api/v1/health`

### Manual deploy from GitHub

**Actions → Deploy to AWS EC2 → Run workflow**

---

## Part 5 — Daily workflow

```text
1. Code locally: npm run dev
2. Test changes locally
3. git add / commit / push origin main
4. GitHub Actions deploys to EC2 automatically
5. Verify: http://YOUR_EC2_IP:5000/api/v1/health
```

Local and production stay separate:

- **Local** uses your PC `.env`
- **EC2** uses server `.env` (not overwritten by CI/CD)

---

## Part 6 — Copy local uploads to EC2 (one-time)

Until S3 is implemented, copy seller images once:

```powershell
# From your Windows machine
scp -r "e:\nexcart\nexcart-api\uploads" ec2-user@YOUR_EC2_IP:/home/ec2-user/nexcart-api/
```

`docker-compose.prod.yml` mounts `./uploads` so files persist across redeploys.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Deploy fails: permission denied | `sudo usermod -aG docker ec2-user`, re-login |
| Health check fails | `docker compose -f docker-compose.prod.yml logs api` |
| CORS errors from Vercel | Add Vercel URL to `CORS_ORIGIN` in EC2 `.env`, redeploy |
| Images 404 | Copy `uploads/` to EC2 or implement S3 (next step) |
| Lint fails in CI | Run `npm run lint` locally and fix |

---

## Security reminders

- Rotate JWT secrets if they were ever shared in chat or commits.
- Use `NODE_ENV=production` on EC2.
- Restrict SSH to your IP when possible.
- Do not store `.env` in GitHub — only EC2 server file + GitHub Secrets for SSH.
