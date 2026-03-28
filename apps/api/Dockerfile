ARG NODE_VERSION=24.13.1

# --------------------
# Base
# --------------------
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Fix global install issue
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN mkdir -p $PNPM_HOME

# --------------------
# Prepare (prune repo)
# --------------------
FROM base AS prepare
WORKDIR /app

RUN pnpm add -g turbo

COPY . .

# Prune only api + its deps
RUN turbo prune api --docker

# --------------------
# Builder
# --------------------
FROM base AS builder
WORKDIR /app

# Copy only lockfile + package.jsons (better caching)
COPY --from=prepare /app/out/json/ .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy full source
COPY --from=prepare /app/out/full/ .

# Optional turbo remote cache
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# Build all required packages
RUN pnpm turbo build

# --------------------
# Runner
# --------------------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

# Enable pnpm (safe, optional)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Non-root user
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

# Copy full built output
COPY --from=builder /app ./

# Start API
CMD ["node", "apps/api/dist/index.js"]