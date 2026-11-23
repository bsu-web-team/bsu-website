# BSU V7.1 — private Linux Docker deployment

This is a **deployment skeleton**, not a certified 10,000-user production setup.
It runs four identical Next.js instances behind one Caddy proxy using the existing
Next.js build. It does not include PostgreSQL, Redis, TLS, backups, monitoring, or
an external frontend load generator.

## Requirements

- Ubuntu/Debian Linux with Docker Engine and Docker Compose plugin
- Sufficient CPU/RAM and storage for a full Next.js build (2,000+ routes)
- Domain, certificates and a secure public ingress **before** public launch

## Start (local/private smoke test)

From the repo root:

```bash
cp deploy/.env.example deploy/.env
docker compose -f deploy/compose.yaml config --quiet
docker compose -f deploy/compose.yaml up -d --build
curl -I http://127.0.0.1:8080/
docker compose -f deploy/compose.yaml ps
```

Compose exposes Caddy **only at 127.0.0.1:8080**. For remote testing, use SSH port
forwarding (`ssh -L 8080:127.0.0.1:8080 user@server`) rather than opening this
port to the Internet. Before production public launch, configure proper DNS,
HTTPS, reverse proxy/CDN and firewall; do not remove the localhost binding alone.

## Management

```bash
docker compose -f deploy/compose.yaml logs -f caddy
docker compose -f deploy/compose.yaml ps
docker compose -f deploy/compose.yaml down
```

## Backend integration

The default `local` mode uses existing static content. Only after API contract and
pagination/validation tests are completed, set `BSU_DATA_SOURCE=backend` and an
accessible `BSU_API_BASE_URL` in deploy/.env (and optionally
`BSU_CONTENT_SOURCE=backend` once the content endpoint exists). The backend
service is not provided by this Compose file.

## Production notes

- Next.js 16 may require coordinating its data cache across replicas; in-memory
  caches are not automatically shared across these four processes.
- A health check at `/` tests reachability, **not** complete backend health.
- Do not load-test public production without approval and isolation.
- Benchmark from a separate machine. 10,000 VUs do not equal 10,000 full browser
  sessions; include HTML, assets, API, and realistic traffic patterns.
- Monitor CPU, RAM, network, errors, upstream status, and response percentiles.
- Pin the Caddy image to a tested release before production rollout.
- Do not commit real `.env` files or credentials.
