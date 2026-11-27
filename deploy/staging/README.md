# BSU staging server

One Docker Compose stack on one Linux VM: PostgreSQL + API + website + Caddy.
Inside the university network the site is at **http://nn.bsu.kg/** (internal DNS,
`192.168.99.57`). It is not reachable from the Internet.

```
browser ──80──> caddy ──> web (Next.js, data from API) ──> api (FastAPI) ──> db (PostgreSQL)
```

- Only Caddy listens on the network (port 80). The API is bound to `127.0.0.1`
  on the server, the database has no published port.
- Plain HTTP, `X-Robots-Tag: noindex`. Optional shared password: see `Caddyfile`.
- `/admin` is **off**: the website enables it only with
  `BSU_ADMIN_PRODUCTION_ENABLED=true` and an HTTPS admin API.
- The database password is generated on the server into `deploy/staging/.env`
  (mode 600, ignored by Git) and never leaves it.

## Requirements

Ubuntu 24.04/26.04 (amd64), Docker Engine with the Compose plugin, the user in
the `docker` group, Internet access to Docker Hub, npm and PyPI, port 80 open
inside the network.

## First deployment

```bash
cd ~ && git clone https://github.com/bsu-web-team/bsu-website.git
cd ~/bsu-website
./deploy/staging/deploy.sh
```

The script:

1. creates `.env` with a random database password (first run only);
2. `git pull` (skip with `--no-pull`);
3. builds and starts `db` and `api`; the API applies Alembic migrations;
4. **only if the database is empty**: exports the website data
   (`scripts/export-backend.cjs` in a temporary Node container) and imports it
   (`python -m app.seed`);
5. builds the website **from the API data** (pages are prerendered, so the API
   must be up during the build) and starts `web` and `caddy`;
6. waits until `http://127.0.0.1/` answers.

The first run takes a few minutes (image downloads and the website build).

## Update

```bash
cd ~/bsu-website && ./deploy/staging/deploy.sh
```

Pulls `main`, rebuilds what changed, applies new migrations, restarts changed
containers. Data stays in the `pgdata` volume. If nothing changed, it takes
seconds. The import never runs again on a non-empty database, because it
**replaces** all public content.

The website caches API data for `BSU_API_REVALIDATE_SECONDS` (default 300 s),
so data changes appear within ~5 minutes without a rebuild.

## Everyday commands

Run from `~/bsu-website/deploy/staging`:

```bash
docker compose ps                    # status
docker compose logs -f --tail 100 web   # logs: web, api, db, caddy
docker compose restart web           # restart one service
docker compose down                  # stop everything (data is kept)
```

Swagger of the API (from your computer, through SSH):

```bash
ssh -L 8000:127.0.0.1:8000 bhu@nn.bsu.kg
```

then open http://127.0.0.1:8000/docs on your computer.

Containers restart automatically after a server reboot (`restart: unless-stopped`).

## Shared password for the whole site (optional)

```bash
cd ~/bsu-website/deploy/staging
docker compose exec caddy caddy hash-password
```

Put the printed hash into the `basic_auth` block of `Caddyfile`, uncomment it,
then `docker compose restart caddy`. This edits a tracked file; commit it or
expect `git pull` to complain about local changes.

## Backups

```bash
./deploy/staging/backup.sh           # ~/bsu-backups/bsu-YYYYmmdd-HHMMSS.dump, keeps 14 days
```

Daily at 03:15 (`crontab -e`):

```
15 3 * * * /home/bhu/bsu-website/deploy/staging/backup.sh >> /home/bhu/bsu-backups/backup.log 2>&1
```

Copy backups off the server too (ask the network admin where).

### Restore

Check a backup without touching the live database:

```bash
cd ~/bsu-website/deploy/staging
docker compose exec -T db psql -U bsu -d postgres -c "CREATE DATABASE restore_test;"
docker compose exec -T db pg_restore -U bsu -d restore_test --no-owner < ~/bsu-backups/FILE.dump
docker compose exec -T db psql -U bsu -d restore_test -c "SELECT count(*) FROM faculties;"
docker compose exec -T db psql -U bsu -d postgres -c "DROP DATABASE restore_test;"
```

Replace the live database (stops the site; take a fresh backup first):

```bash
docker compose stop web api
docker compose exec -T db pg_restore -U bsu -d bsu --clean --if-exists --no-owner < ~/bsu-backups/FILE.dump
docker compose start api web
```

## Troubleshooting

| Symptom | Check |
|---|---|
| `http://nn.bsu.kg` does not open | You are in the university network; `curl -I http://127.0.0.1/` on the server works; firewall: `sudo ufw status` (allow `80/tcp` if active) |
| Build fails: `BSU API unavailable` | `docker compose logs api`; the API must be healthy before `web` is built |
| `bind: address already in use` for 80 or 8000 | Change `HTTP_PORT` / `API_PORT` in `.env`, run `deploy.sh` again |
| `permission denied ... docker.sock` | User not in the `docker` group, or not logged in again after adding |
| Disk filling up | `docker system df`; `docker image prune` (deploy.sh prunes dangling images) |

## Not covered yet

HTTPS (needs a public name or an internal CA), admin panel, off-server backups,
monitoring, log rotation limits. Do not expose this stack to the Internet as is.
