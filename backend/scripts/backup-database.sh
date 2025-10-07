#\!/bin/bash

# Elimu Smart Database Backup Script
# Backs up production and staging PostgreSQL databases

# Configuration
BACKUP_DIR="/root/elimu_smart_backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=30
DB_USER="postgres"
DB_PASSWORD="El1musmart2024"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Export password for pg_dump
export PGPASSWORD="$DB_PASSWORD"

echo "=== Elimu Smart Database Backup - $TIMESTAMP ==="

# Backup production database
echo "Backing up production database..."
pg_dump -U "$DB_USER" -h localhost elimu_smart_production | gzip > "$BACKUP_DIR/prod_${TIMESTAMP}.sql.gz"
if [ $? -eq 0 ]; then
    echo "✓ Production backup completed: prod_${TIMESTAMP}.sql.gz"
else
    echo "✗ Production backup failed\!"
fi

# Backup staging database
echo "Backing up staging database..."
pg_dump -U "$DB_USER" -h localhost elimu_smart_staging | gzip > "$BACKUP_DIR/staging_${TIMESTAMP}.sql.gz"
if [ $? -eq 0 ]; then
    echo "✓ Staging backup completed: staging_${TIMESTAMP}.sql.gz"
else
    echo "✗ Staging backup failed\!"
fi

# Cleanup old backups (older than RETENTION_DAYS)
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
echo "✓ Cleanup completed"

# Show backup summary
echo ""
echo "=== Backup Summary ==="
du -sh "$BACKUP_DIR"
ls -lh "$BACKUP_DIR" | tail -5

# Unset password
unset PGPASSWORD

echo "=== Backup completed at $(date) ==="
