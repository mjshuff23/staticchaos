#!/usr/bin/env node
'use strict';

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

function usage(): void {
  console.log('Usage: mud-watch.js <dev|prod> [port] [intervalMs]');
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length < 1) {
  usage();
}

const envName = args[0];
const port = args[1] || (envName === 'prod' ? '5000' : '4000');
const intervalMs = Number.parseInt(args[2] || '1000', 10);

if (!Number.isFinite(intervalMs) || intervalMs < 200) {
  usage();
}

const repoRoot = path.resolve(__dirname, '..');
const srcDir = path.join(repoRoot, 'src');
const mudJs = path.join(__dirname, 'mud.js');

function listSourceFiles(dir: string, out: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listSourceFiles(fullPath, out);
      continue;
    }
    if (entry.name.endsWith('.c') || entry.name.endsWith('.h')) {
      out.push(fullPath);
    }
  }
  return out;
}

function snapshot(files: string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const file of files) {
    try {
      const stat = fs.statSync(file);
      map.set(file, stat.mtimeMs);
    } catch (err) {
      // File might have been deleted between scans; ignore for now.
    }
  }
  return map;
}

function hasChanged(prev: Map<string, number>, next: Map<string, number>): boolean {
  if (prev.size !== next.size) {
    return true;
  }
  for (const [file, mtime] of next.entries()) {
    if (!prev.has(file) || prev.get(file) !== mtime) {
      return true;
    }
  }
  return false;
}

function runCommand(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit' });
    child.on('close', (code: number | null) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

let inFlight = false;
let pending = false;

async function buildAndRestart() {
  if (inFlight) {
    pending = true;
    return;
  }
  inFlight = true;
  try {
    await runCommand('make', ['chaosium'], path.join(repoRoot, 'src'));
    await runCommand('node', [mudJs, 'restart', envName, port], repoRoot);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Watch build failed: ${message}`);
  } finally {
    inFlight = false;
    if (pending) {
      pending = false;
      await buildAndRestart();
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  const files = listSourceFiles(srcDir);
  let last = snapshot(files);

  // Start once at launch so you always have a running server.
  await buildAndRestart();

  // Polling avoids recursive fs.watch quirks on Linux/WSL.
  while (true) {
    await sleep(intervalMs);
    const currentFiles = listSourceFiles(srcDir);
    const next = snapshot(currentFiles);
    if (hasChanged(last, next)) {
      last = next;
      await buildAndRestart();
    }
  }
})();
