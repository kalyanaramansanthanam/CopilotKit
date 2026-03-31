#!/bin/bash
set -e

# Start .NET agent backend
dotnet /agent/ProverbsAgent.dll --urls "http://0.0.0.0:8000" &

# Start Next.js frontend
npx next start --port 3000 &

# Wait for either process to exit
wait -n
exit $?
