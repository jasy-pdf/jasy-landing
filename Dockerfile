# Stage 1: Build
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Toolchain for native modules (better-sqlite3 used by @nuxt/content).
RUN apt-get update && apt-get install -y \
    python3 make g++ git \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@9.15.0

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Stage 2: Production
FROM node:22-bookworm-slim

WORKDIR /app

# The Nitro output already carries the traced node_modules (incl. the compiled
# better-sqlite3 binary, ABI-compatible with this same base image).
COPY --from=builder /app/.output ./.output

EXPOSE 3000

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]
