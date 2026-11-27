#!/usr/bin/env bash
# Deploy or update the BSU staging server. Run from anywhere:
#   ./deploy/staging/deploy.sh            # pull main, build, start
#   ./deploy/staging/deploy.sh --no-pull  # deploy the code as it is now
# First run also creates .env (random DB password) and imports the website data.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
cd "$HERE"
compose() { docker compose -f "$HERE/compose.yaml" "$@"; }
log() { printf '\n==> %s\n' "$*"; }

# 1. Settings. The password is generated here and never leaves the server.
if [ ! -f .env ]; then
  log "Creating deploy/staging/.env with a random database password"
  sed "s/^POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$(openssl rand -hex 24)/" .env.example > .env
  chmod 600 .env
fi
set -a; . ./.env; set +a
API_PORT="${API_PORT:-8000}"; HTTP_PORT="${HTTP_PORT:-80}"

# 2. Code.
if [ "${1:-}" != "--no-pull" ]; then
  log "Updating code (git pull)"
  git -C "$REPO" pull --ff-only
fi
log "Version: $(git -C "$REPO" log --oneline -1)"

# 3. Database and API (the API applies migrations on start).
# Create the export folder as the current user; otherwise Docker creates it as root.
mkdir -p "$REPO/backend-export"
log "Starting database and API"
compose up -d --build db api
for i in $(seq 1 60); do
  curl -fsS "http://127.0.0.1:$API_PORT/api/v1/health" >/dev/null 2>&1 && break
  [ "$i" = 60 ] && { echo "API did not become healthy:"; compose logs --tail 50 api; exit 1; }
  sleep 2
done

# 4. First run only: import website data. Never re-imports over existing content,
#    because the import REPLACES all public content (admin-approved edits included).
COUNT="$(compose exec -T db psql -U bsu -d bsu -tAc 'SELECT count(*) FROM faculties' | tr -d '[:space:]')"
if [ "$COUNT" = "0" ]; then
  log "Empty database: exporting website data and importing it"
  TS_VERSION="$(sed -n 's/.*"node_modules\/typescript": {[^}]*"version": "\([^"]*\)".*/\1/p' <(tr -d '\n' < "$REPO/package-lock.json"))"
  docker run --rm --user "$(id -u):$(id -g)" -e HOME=/tmp -e NODE_PATH=/tmp/ts/node_modules \
    -v "$REPO":/app -w /app node:22-bookworm-slim \
    sh -c "npm install --silent --no-audit --no-fund --prefix /tmp/ts typescript@${TS_VERSION:-5} && node scripts/export-backend.cjs"
  compose run --rm api python -m app.seed --source /export
else
  log "Database already has data ($COUNT faculties): import skipped"
fi

# 5. Website: built from the API data, then started with Caddy.
log "Building the website (takes a few minutes)"
compose build web
compose up -d web caddy
for i in $(seq 1 60); do
  curl -fsS -o /dev/null "http://127.0.0.1:$HTTP_PORT/" 2>/dev/null && break
  [ "$i" = 60 ] && { echo "Website did not respond:"; compose logs --tail 50 web caddy; exit 1; }
  sleep 3
done

compose ps
log "Done: http://$(hostname -I | awk '{print $1}')$( [ "$HTTP_PORT" = 80 ] || echo ":$HTTP_PORT")/ (and http://nn.bsu.kg/ in the university network)"
docker image prune -f >/dev/null
