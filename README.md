# turbo-base

A [Turborepo](https://turbo.build/repo) monore starter with multiple frontends, a Node.js API, shared packages, and Docker builds for production-style deployment.

## Stack

| Area | Technology |
|------|------------|
| Monorepo | Turborepo, pnpm workspaces |
| Next.js app | `apps/web` — Next.js 16, React 19, Tailwind CSS 4 |
| React SPA | `apps/web-react` — Vite 8, React 19, Tailwind CSS 4 |
| API | `apps/api` — Express, Jest (via `@repo/jest-presets`) |
| Database | `packages/database` — Prisma, PostgreSQL |
| Tooling | TypeScript, ESLint, Prettier |

## Prerequisites

- **Node.js** 18 or newer (repo engines and Dockerfiles target current LTS-style versions)
- **pnpm** 9.x (enabled via Corepack: `corepack enable`)
- **Docker** and Docker Compose (for containerized run)

## Getting started locally

1. **Clone and install dependencies**

   ```bash
   git clone https://github.com/SajalDBansal/turbo-fullstack-starter turbo-base
   cd turbo-base
   corepack enable
   pnpm install
   ```

2. **Environment variables**

   - Copy the root example and adjust for your machine:

     ```bash
     cp .env.example packages/database/.env
     ```

   - Set `DATABASE_URL` in `packages/database/.env` to match your PostgreSQL instance. For the database service defined in `docker-compose.yml` (user `sebi`, password `sebi_test_4444`, database `turborepo`), a URL from the host looks like:

     ```text
     postgresql://sebi:sebi_test_4444@localhost:5432/turborepo?schema=public
     ```

   - `turbo.json` references `NEXT_PUBLIC_API_HOST` for Next.js builds when you wire the UI to the API.

3. **Database (optional but needed for Prisma)**

   Start Postgres (see [Docker](#docker) below) or use any local PostgreSQL. Then from the repo root:

   ```bash
   pnpm generate
   pnpm db:migrate:dev
   # optional
   pnpm db:seed
   ```

4. **Development**

   ```bash
   pnpm dev
   ```

   Turbo runs `dev` in each app. Typical ports:

   - **Next.js** (`web`): `http://localhost:3001` (see `apps/web/package.json`)
   - **Vite React** (`web-react`): `http://localhost:5173` (Vite default)
   - **API** (`api`): `http://localhost:8080`

5. **Other useful commands**

   ```bash
   pnpm build
   pnpm lint
   pnpm check-types
   ```

   Run tests for the API:

   ```bash
   pnpm --filter api test
   ```

## Docker

The compose file builds **three Node services** (API, Next.js, static React via nginx) and a **PostgreSQL 15** instance on a shared user-defined bridge network.

### One-time: create the external network

`docker-compose.yml` declares `app_network` as **external**. Create it once:

```bash
docker network create app_network
```

### Build images

From the repository root:

```bash
docker compose build
```

Build a single service:

```bash
docker compose build web
docker compose build api
docker compose build web-react
```

### Run the stack

Start everything in the background:

```bash
docker compose up -d
```

Follow logs:

```bash
docker compose logs -f
```

Stop and remove containers (volumes for Postgres are kept):

```bash
docker compose down
```

### Published ports

| Service | Host port | Notes |
|---------|-----------|--------|
| `web` (Next.js) | [http://localhost:3000](http://localhost:3000) | Mapped to the standalone server in the container |
| `api` (Express) | [http://localhost:8080](http://localhost:8080) | e.g. `GET /status` |
| `web-react` (nginx) | [http://localhost:3001](http://localhost:3001) | Serves the Vite production build on port 80 in-container |
| `db` (PostgreSQL) | `localhost:5432` | Credentials match `docker-compose.yml` (`POSTGRES_*`) |

### Prisma and Docker

Compose starts Postgres, but **migration and `DATABASE_URL` injection for apps are not fully wired in compose** yet. For local iteration, run migrations from the host with `DATABASE_URL` pointing at `localhost:5432`, or extend the `api` (and any Prisma-backed service) with env vars and an entrypoint that runs `prisma migrate deploy` before start—see the Todo section below.

## Repository layout

```text
apps/
  api/           Express API
  web/           Next.js app
  web-react/     Vite + React SPA
packages/
  database/      Prisma schema & client
  eslint-config/, jest-presets/, tailwind-config/, typescript-config/
```

## Todo

> **Pending:** Create the base frontend and Node.js API routes for the project (shared patterns, versioning, and alignment between `web`, `web-react`, and `api`).

> **Pending:** Manage environment variables across the application (single source of truth, `.env` / Docker / CI parity, documented `DATABASE_URL`, `PORT`, `NEXT_PUBLIC_*`, and secrets handling).
