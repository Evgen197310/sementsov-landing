#!/bin/sh
set -e

# Copy pre-built DB on first start
if [ ! -f /app/data/prod.db ]; then
  echo "First start: copying initial database..."
  cp /app/prisma/seed.db /app/data/prod.db
  echo "Database ready."
fi

# Apply pending migrations
echo "Applying migrations..."
npx prisma migrate deploy --schema /app/prisma/schema.prisma 2>/dev/null || echo "Migration skipped (prisma CLI not available)"

exec node server.js
