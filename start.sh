#!/bin/zsh
# TravelSphere - Start all services
# Run this from your terminal: bash start.sh

export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 TravelSphere Launcher"
echo "========================"

# Kill anything on 4000 or 5173
echo "⏹  Clearing ports 4000 and 5173..."
lsof -ti:4000,5173 | xargs kill -9 2>/dev/null || true
sleep 1

# Start backend
echo "🔧 Starting backend on http://localhost:4000..."
cd "$ROOT"
NODE_ENV=development ./node_modules/.bin/tsx server/src/server.ts &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to bind
echo "   Waiting for backend..."
for i in $(seq 1 15); do
  sleep 1
  if curl -s --max-time 1 http://localhost:4000/health > /dev/null 2>&1; then
    echo "   ✅ Backend ready!"
    break
  fi
  echo "   ... ($i/15)"
done

# Start frontend
echo "🎨 Starting frontend on http://localhost:5173..."
cd "$ROOT/client"
../node_modules/.bin/vite --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Both servers started!"
echo "   Backend:  http://localhost:4000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers."
echo ""

# Wait for either to exit
wait $BACKEND_PID $FRONTEND_PID
