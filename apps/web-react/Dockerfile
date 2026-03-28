ARG NODE_VERSION=24.13.1

# 1. Base stage for shared environment settings
FROM node:${NODE_VERSION}-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN mkdir -p $PNPM_HOME
WORKDIR /app

# 2. Prune stage: Extract only the target app's dependency graph
FROM base AS pruner
RUN pnpm add -g turbo
COPY . .
# Replace 'web' with your actual package name
RUN turbo prune web-react --docker

# 3. Installer stage: Install dependencies using the pruned lockfile
FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# 4. Builder stage: Build the React application
FROM base AS builder
# COPY --from=pruner /app/out/full/ .
# RUN pnpm turbo run build --filter=web-react
WORKDIR /app

# Copy full source
COPY . .

# Install dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Run Turbo build
RUN pnpm turbo run build --filter=web-react

# 5. Runner stage: Serve the production build
# For a standard React SPA, use a lightweight server like Nginx
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html
# Adjust the path below to match your app's build output directory
COPY --from=builder /app/apps/web-react/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
