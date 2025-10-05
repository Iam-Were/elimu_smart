#!/bin/bash
# Daily PostgreSQL Backup Script for Elimu Smart
# Configured to run via cron at 2 AM daily

set -e

# Configuration
DB_NAME="elimu_smart_prod"
BACKUP_DIR="$HOME/elimu_smart_backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/elimu_smart_${DATE}.sql"
DAYS_TO_KEEP=30  # Keep backups for 30 days

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Dump PostgreSQL database
echo "[$(date)] Starting database backup..."
pg_dump -U elimu $DB_NAME > "$BACKUP_FILE"

# Compress backup
echo "[$(date)] Compressing backup..."
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Upload to Backblaze B2 (if configured)
if [ ! -z "$B2_APPLICATION_KEY_ID" ]; then
    echo "[$(date)] Uploading to Backblaze B2..."
    b2 upload-file elimu-smart-backups "$BACKUP_FILE" "backups/$(basename $BACKUP_FILE)"
    echo "[$(date)] Upload complete"
fi

# Alternative: Upload to GitHub as encrypted release asset
# if [ ! -z "$GITHUB_TOKEN" ]; then
#     echo "[$(date)] Encrypting and uploading to GitHub..."
#     openssl enc -aes-256-cbc -salt -in "$BACKUP_FILE" -out "${BACKUP_FILE}.enc" -k "$BACKUP_ENCRYPTION_KEY"
#     # Use GitHub API to upload as release asset
# fi

# Delete old backups (keep last 30 days)
echo "[$(date)] Cleaning up old backups..."
find "$BACKUP_DIR" -name "elimu_smart_*.sql.gz" -mtime +$DAYS_TO_KEEP -delete

echo "[$(date)] Backup complete: $BACKUP_FILE"
echo "[$(date)] Backup size: $(du -h $BACKUP_FILE | cut -f1)"
