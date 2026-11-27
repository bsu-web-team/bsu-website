#!/usr/bin/env bash
# Database backup (custom format) with rotation. Usage:
#   ./deploy/staging/backup.sh                 # writes to ~/bsu-backups, keeps 14 days
#   BACKUP_DIR=/mnt/backups KEEP_DAYS=30 ./deploy/staging/backup.sh
# Daily at 03:15 (crontab -e):
#   15 3 * * * /home/bhu/bsu-website/deploy/staging/backup.sh >> /home/bhu/bsu-backups/backup.log 2>&1
# Restore: see deploy/staging/README.md.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$HOME/bsu-backups}"
KEEP_DAYS="${KEEP_DAYS:-14}"
mkdir -p "$BACKUP_DIR"; chmod 700 "$BACKUP_DIR"

FILE="$BACKUP_DIR/bsu-$(date +%Y%m%d-%H%M%S).dump"
docker compose -f "$HERE/compose.yaml" exec -T db pg_dump -U bsu -d bsu -Fc > "$FILE.tmp"
mv "$FILE.tmp" "$FILE"
chmod 600 "$FILE"
find "$BACKUP_DIR" -name 'bsu-*.dump' -mtime "+$KEEP_DAYS" -delete
echo "$(date -Is) backup OK: $FILE ($(du -h "$FILE" | cut -f1))"
