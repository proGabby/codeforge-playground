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
const gocacheDir = path.join(projectRoot, '.gocache');

export function warmupCache(binPath) {
  if (!fs.existsSync(gocacheDir)) {
    fs.mkdirSync(gocacheDir, { recursive: true });
  }

  const warmupSrc = `package main
import (
  "bufio"
  "fmt"
  "math"
  "os"
  "sort"
  "strconv"
  "strings"
  "time"
)
func main() {
  _ = fmt.Sprintf("%v %v %v %v", strings.ToUpper("codeforge"), strconv.Itoa(1), math.Pi, time.Now())
  _ = bufio.NewReader(os.Stdin)
  _ = sort.Ints
}
`;
  const warmupFile = path.join(projectRoot, 'warmup_runner.go');
  fs.writeFileSync(warmupFile, warmupSrc);

  console.log('[CodeForge] Pre-compiling Go standard library into .gocache/...');
  try {
    const isCustomGo = fs.existsSync(goDir);
    const env = {
      ...process.env,
      GOCACHE: gocacheDir,
      CGO_ENABLED: '0',
      GOPROXY: 'off',
    };
    if (isCustomGo) {
      env.GOROOT = goDir;
      env.PATH = `${path.join(goDir, 'bin')}:${process.env.PATH || ''}`;
    }

    execSync(`"${binPath}" run warmup_runner.go`, { cwd: projectRoot, env, stdio: 'inherit' });
    console.log('[CodeForge] Go standard library pre-compiled and cached successfully!');
  } catch (err) {
    console.warn('[CodeForge] Note on cache warmup:', err.message);
  } finally {
    try {
      fs.unlinkSync(warmupFile);
    } catch { }
  }
}

function checkGo() {
  // Check if .go/bin/go exists in project root (prioritize persistent project toolchain)
  if (fs.existsSync(goBin)) {
    try {
      const version = execSync(`"${goBin}" version`, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
      console.log(`[CodeForge] Local Go compiler found: ${version.trim()}`);
      return goBin;
    } catch {
      // Corrupt or failed
    }
  }

  // Check system go
  try {
    const version = execSync('go version', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
    console.log(`[CodeForge] System Go compiler found: ${version.trim()}`);
    return 'go';
  } catch {
    // Not in PATH
  }

  return null;
}

export function ensureGo() {
  const existing = checkGo();
  if (existing) {
    warmupCache(existing);
    return existing;
  }

  console.log('[CodeForge] Go compiler not found. Automatically installing Go 1.22 into .go/...');

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

    // Pre-warm the cache immediately
    warmupCache(goBin);

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
