# Company Management (MicroManager)

Spring Boot 4 API + Next.js 16 dashboard for managing projects, team members and personal tasks.

```
browser ──► Next.js (3000) ──► Spring Boot API (8080, internal) ──► PostgreSQL
```

The browser only talks to Next.js. All API calls are made server-side (server components and
server actions) with the user's backend token, so the API port does not need to be public.

## Quick start (Docker)

```bash
cp .env.example .env
# fill in POSTGRES_PASSWORD, JWT_SECRET, AUTH_SECRET (and INTERNAL_API_SECRET for Google sign-in)
#   openssl rand -base64 48
docker compose up --build
```

Open http://localhost:3000. On an empty database an administrator is created from
`ADMIN_USERNAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD`; if `ADMIN_PASSWORD` is empty a random
password is generated and printed once in the backend log (`docker compose logs backend`).

## Local development

Backend (Java 17):

```bash
cd backend
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/management
export SPRING_DATASOURCE_USERNAME=... SPRING_DATASOURCE_PASSWORD=...
export JWT_SECRET=$(openssl rand -base64 48)
./mvnw spring-boot:run          # tests: ./mvnw test
```

Frontend (Node 20+):

```bash
cd frontend
# .env.local: AUTH_SECRET=..., INTERNAL_API_URL=http://localhost:8080/api, SPRING_BOOT_API_URL=http://localhost:8080
npm install --legacy-peer-deps
npm run dev
```

## Tests

* Backend unit tests: `cd backend && ./mvnw test`
* Frontend static checks: `cd frontend && npx tsc --noEmit && npx eslint src`
* End-to-end UI + API QA against a throwaway stack: see [`e2e/README.md`](e2e/README.md)

## Configuration

| Variable | Used by | Purpose |
| --- | --- | --- |
| `JWT_SECRET` | backend | Signs API tokens (≥ 32 chars, required) |
| `JWT_EXPIRATION_MS` | backend | Token lifetime, default 24h |
| `INTERNAL_API_SECRET` | both | Shared secret for `/api/auth/social`; Google sign-in is disabled without it |
| `AUTH_SECRET` | frontend | Encrypts the Auth.js session cookie |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | frontend | Optional Google sign-in |
| `ADMIN_*`, `SEED_DEMO_DATA` | backend | First-run seed data |
| `API_DOCS_ENABLED` | backend | Swagger UI at `/swagger-ui.html` (default on) |

## Roles

* **System role** (`USER` / `ADMIN`) controls access. New registrations are always `USER`.
* **Project role** (Developer / Manager / Designer) is set when an admin assigns a user to a project.
* Admin console: maintenance mode (only admins can use the API while on), cache flush,
  restart/shutdown (the container restart policy brings the backend back).
