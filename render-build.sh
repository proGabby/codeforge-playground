#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "=== 1/3: Installing npm dependencies (including build tools) ==="
npm install --include=dev

echo "=== 2/3: Building Vite React frontend ==="
npm run build

echo "=== 3/3: Ensuring Go compiler is available ==="
if command -v go >/dev/null 2>&1; then
  echo "Go is already installed on system: $(go version)"
else
  echo "Downloading Go 1.22.5 for Linux..."
  GO_VERSION="1.22.5"
  curl -fsSL "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" -o /tmp/go.tar.gz
  tar -C /tmp -xzf /tmp/go.tar.gz
  rm /tmp/go.tar.gz
  export PATH="/tmp/go/bin:$PATH"
  echo "Go installed successfully to /tmp/go/bin/go"
fi

echo "=== CodeForge build finished successfully ==="

