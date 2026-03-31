#!/bin/bash
set -e

# Start Claude agent backend (TypeScript)
node /app/agent_server.js &

# Start Next.js frontend
npx next start --port 3000 &

# Wait for either process to exit
wait -n
exit $?
