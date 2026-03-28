ARG NODE_VERSION=24.13.1

# --------------------
# Base
# --------------------
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Fix global install issue
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN mkdir -p $PNPM_HOME

# --------------------
# Prepare (prune repo)
# --------------------
FROM base AS prepare
RUN pnpm add -g turbo

COPY . .

# Generate pruned monorepo for web
RUN turbo prune web --docker

# --------------------
# Builder
# --------------------
FROM base AS builder

# Copy only package.json + lockfiles (better caching)
COPY --from=prepare /app/out/json/ .

# Install deps using pnpm
RUN pnpm install --frozen-lockfile

# Copy full source
COPY --from=prepare /app/out/full/ .


# Optional: remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# Build
RUN pnpm turbo build

# --------------------
# Runner (production)
# --------------------
FROM node:${NODE_VERSION}-slim AS runner

WORKDIR /app

# Enable pnpm (not always needed at runtime, but safe)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD ["node", "apps/web/server.js"]
