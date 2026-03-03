#!/bin/sh
set -e

# Copy pre-built DB on first start
if [ ! -f /app/data/prod.db ]; then
  echo "First start: copying initial database..."
  cp /app/prisma/seed.db /app/data/prod.db
  echo "Database ready."
fi

exec node server.js
