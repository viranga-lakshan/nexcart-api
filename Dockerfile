FROM node:22-alpine AS builder

WORKDIR /app

ARG DATABASE_URL=postgresql://nexcart:nexcart@postgres:5432/nexcart?schema=public

ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN npm prune --omit=dev

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://nexcart:nexcart@postgres:5432/nexcart?schema=public

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src ./src

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy --schema=src/prisma/schema.prisma && npm start"]
