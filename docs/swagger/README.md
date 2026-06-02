Swagger admin UI
================

Access: /docs/swagger (admin-only)

This route renders a Swagger UI using the OpenAPI JSON served from `/docs/swagger/spec`.

Notes:
- The UI is protected server-side by the existing admin guard (`src/lib/auth/admin-guard.ts`).
- The UI loads `swagger-ui-dist` from a CDN. If you prefer a local copy, replace the CDN links in `src/app/docs/swagger/route.ts`.
