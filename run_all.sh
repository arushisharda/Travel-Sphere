#!/bin/bash
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
cd "/Users/aadarshparnar/Documents/antigravity/travelsphere"
lsof -ti:4000,5173 | xargs kill -9 2>/dev/null || true

node node_modules/.bin/tsx server/src/server.ts > /tmp/backend.log 2>&1 &
echo $! > /tmp/backend.pid

cd client
../node_modules/.bin/vite --host 0.0.0.0 --port 5173 > /tmp/frontend.log 2>&1 &
echo $! > /tmp/frontend.pid

sleep 5
echo "=== BACKEND LOG ==="
cat /tmp/backend.log
echo "=== FRONTEND LOG ==="
cat /tmp/frontend.log
