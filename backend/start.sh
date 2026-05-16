#!/bin/bash
set -euo pipefail

echo "Waiting for the database to be ready..."
sleep 5
echo "Database is ready."

# Run database migrations
for file in ./drizzle/*.sql; do
  echo "Running migration: $file"
  psql $DATABASE_URL --file "$file"
done
echo "Database migrations completed."

# Start the application
echo "Starting the application..."
bun run index.js