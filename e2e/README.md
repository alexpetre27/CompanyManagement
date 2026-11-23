# End-to-end QA

Two suites that run against the full docker compose stack:

| Suite | What it covers |
| --- | --- |
| `tests/` (Playwright) | Real Chromium, desktop + mobile: auth, role restrictions, tasks, projects, team assignment, settings/avatar, admin console, maintenance banner, status page, layout overflow. Fails on any console error, uncaught exception, broken sub-resource or 5xx. |
| `api-qa.sh` | ~135 API checks: validation and boundaries, race conditions, token forgery, IDOR, upload hardening, CORS/headers, latency, and a backend restart. |

> **Both suites create users/projects, toggle maintenance mode and restart the backend.**
> Run them only against a throwaway stack with an empty database, never against real data.

## Run

```bash
# from the repo root: a fresh stack with a known admin password
cp .env.example .env          # set secrets and ADMIN_PASSWORD (e.g. AdminPass123)
docker compose down -v && docker compose up -d --build --wait

cd e2e
npm ci && npm run install:browsers
E2E_ADMIN_PASSWORD=AdminPass123 npm run test:ui

# the API suite expects a fresh database too
cd .. && docker compose down -v && docker compose up -d --wait && cd e2e
npm run test:api              # reads ADMIN_* and INTERNAL_API_SECRET from ../.env
```

Requires `bash`, `curl` and `node`. Optional overrides: `E2E_FRONTEND_URL`,
`E2E_BACKEND_URL`, `E2E_API_URL`, `E2E_ADMIN_USERNAME`, `E2E_ADMIN_PASSWORD`.
