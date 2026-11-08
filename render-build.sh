#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "=== 1/3: Installing npm dependencies (including build tools) ==="
npm install --include=dev

echo "=== 2/3: Ensuring Go compiler is available ==="
node scripts/ensure-go.js

echo "=== 3/3: Building Vite React frontend ==="
npm run build

echo "=== CodeForge build finished successfully ==="

