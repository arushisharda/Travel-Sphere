#!/bin/bash
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "Clearing old ports..."
lsof -ti:4000,5173 | xargs kill -9 2>/dev/null || true
sleep 1

echo "1. Starting Backend..."
npx tsx server/src/server.ts &
BACKEND_PID=$!

echo "2. Starting Frontend..."
cd client
npx vite --port 5173 --host 0.0.0.0 &
FRONTEND_PID=$!

echo "Both started! Keep this terminal window open."
wait $BACKEND_PID $FRONTEND_PID
