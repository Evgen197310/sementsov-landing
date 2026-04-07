#!/bin/sh
set -e

DB_PATH="/app/data/prod.db"

# Copy pre-built DB on first start
if [ ! -f "$DB_PATH" ]; then
  echo "First start: copying initial database..."
  cp /app/prisma/seed.db "$DB_PATH"
  echo "Database ready."
fi

# Apply pending migrations using sqlite3 directly
echo "Checking for pending migrations..."
for migration_dir in /app/prisma/migrations/*/; do
  migration_name=$(basename "$migration_dir")
  # Skip _migration_lock.toml directory
  [ "$migration_name" = "_migration_lock.toml" ] && continue
  sql_file="$migration_dir/migration.sql"
  [ ! -f "$sql_file" ] && continue

  # Check if already applied
  applied=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM _prisma_migrations WHERE migration_name='$migration_name';" 2>/dev/null || echo "0")
  if [ "$applied" = "0" ]; then
    echo "Applying migration: $migration_name"
    sqlite3 "$DB_PATH" < "$sql_file"
    # Record in _prisma_migrations
    checksum=$(md5sum "$sql_file" | cut -d' ' -f1)
    sqlite3 "$DB_PATH" "INSERT INTO _prisma_migrations (id, checksum, migration_name, finished_at, applied_steps_count) VALUES (lower(hex(randomblob(16))), '$checksum', '$migration_name', datetime('now'), 1);"
    echo "Migration applied: $migration_name"
  fi
done
echo "Migrations complete."

exec node server.js
