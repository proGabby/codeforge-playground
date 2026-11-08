#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const goDir = path.join(projectRoot, '.go');
const goBin = path.join(goDir, 'bin', process.platform === 'win32' ? 'go.exe' : 'go');

function checkGo() {
  // 1. Check if system go is available
  try {
    const version = execSync('go version', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
    console.log(`[CodeForge] System Go compiler found: ${version.trim()}`);
    return true;
  } catch {
    // Not in PATH
  }

  // 2. Check if .go/bin/go exists in project root
  if (fs.existsSync(goBin)) {
    try {
      const version = execSync(`"${goBin}" version`, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
      console.log(`[CodeForge] Local Go compiler found: ${version.trim()}`);
      return true;
    } catch {
      // Exists but failed to run
    }
  }

  return false;
}

export function ensureGo() {
  if (checkGo()) {
    return goBin;
  }

  console.log('[CodeForge] Go compiler not found. Automatically installing Go 1.22...');

  const platform = process.platform;
  const arch = process.arch === 'arm64' ? 'arm64' : 'amd64';

  let osType = 'linux';
  if (platform === 'darwin') osType = 'darwin';
  else if (platform === 'win32') osType = 'windows';

  const ext = osType === 'windows' ? 'zip' : 'tar.gz';
  const url = `https://go.dev/dl/go1.22.5.${osType}-${arch}.${ext}`;

  console.log(`[CodeForge] Downloading Go from ${url}...`);

  if (!fs.existsSync(goDir)) {
    fs.mkdirSync(goDir, { recursive: true });
  }

  try {
    const tarPath = path.join(projectRoot, `go-dl.${ext}`);
    execSync(`curl -fsSL "${url}" -o "${tarPath}"`, { stdio: 'inherit' });

    console.log('[CodeForge] Extracting Go toolchain to .go/...');
    execSync(`tar -C "${goDir}" --strip-components=1 -xzf "${tarPath}"`, { stdio: 'inherit' });

    try {
      fs.unlinkSync(tarPath);
    } catch { }

    const version = execSync(`"${goBin}" version`, { encoding: 'utf-8' });
    console.log(`[CodeForge] Go successfully installed: ${version.trim()}`);
    return goBin;
  } catch (err) {
    console.error('[CodeForge] Failed to auto-install Go:', err.message);
    return null;
  }
}

// When run directly from CLI (e.g. npm run prebuild or node scripts/ensure-go.js)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  ensureGo();
}

