#!/usr/bin/env node
'use strict';

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ACTIONS = ['start', 'stop', 'restart', 'status'] as const;

type Action = (typeof ACTIONS)[number];

function usage(): void {
  console.log('Usage: mud.js <start|stop|restart|status> <dev|prod> [port]');
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length < 2) {
  usage();
}

const action = args[0] as Action;
const envName = args[1];
const portArg = args[2];

if (!ACTIONS.includes(action)) {
  usage();
}

const repoRoot = path.resolve(__dirname, '..');
const envRoot = path.join(repoRoot, 'env', envName);
const logRoot = path.join(envRoot, 'log');
const pidFile = path.join(logRoot, 'mud.pid');
const runEnv = path.join(repoRoot, 'scripts', 'run-env.sh');

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function readPid(): number | null {
  if (!fs.existsSync(pidFile)) {
    return null;
  }
  const raw = fs.readFileSync(pidFile, 'utf8').trim();
  const pid = Number.parseInt(raw, 10);
  return Number.isFinite(pid) ? pid : null;
}

function isRunning(pid: number | null): boolean {
  if (!pid) {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return false;
  }
}

function writePid(pid: number) {
  fs.writeFileSync(pidFile, `${pid}\n`);
}

function start() {
  ensureDir(logRoot);

  const existing = readPid();
  if (existing && isRunning(existing)) {
    console.log(`Already running (pid ${existing}).`);
    return;
  }
  if (existing) {
    fs.unlinkSync(pidFile);
  }

  const port = portArg || (envName === 'prod' ? '5000' : '4000');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const wrapperLog = path.join(logRoot, `wrapper-${stamp}.log`);
  const out = fs.openSync(wrapperLog, 'a');

  // Detach so the MUD keeps running after this wrapper exits.
  const child = spawn(runEnv, [envName, port], {
    cwd: repoRoot,
    detached: true,
    stdio: ['ignore', out, out],
  });
  child.unref();
  if (child.pid === undefined) {
    console.log('Failed to start server (no PID).');
    return;
  }
  writePid(child.pid);

  console.log(`Started ${envName} on port ${port} (pid ${child.pid}).`);
  console.log(`Wrapper log: ${wrapperLog}`);
}

function stop() {
  const pid = readPid();
  if (!pid) {
    console.log('Not running (no pid file).');
    return;
  }

  if (!isRunning(pid)) {
    console.log(`Stale pid file (${pid}); removing.`);
    fs.unlinkSync(pidFile);
    return;
  }

  try {
    // Negative PID targets the whole process group when possible.
    process.kill(-pid, 'SIGTERM');
  } catch (err) {
    try {
      process.kill(pid, 'SIGTERM');
    } catch (err2) {
      console.log(`Failed to stop pid ${pid}: ${(err2 as Error).message}`);
      return;
    }
  }

  console.log(`Stop signal sent to pid ${pid}.`);
}

function status() {
  const pid = readPid();
  if (!pid) {
    console.log('Not running.');
    return;
  }
  if (isRunning(pid)) {
    console.log(`Running (pid ${pid}).`);
    return;
  }
  console.log(`Not running (stale pid ${pid}).`);
}

function restart() {
  stop();
  start();
}

if (action === 'start') {
  start();
} else if (action === 'stop') {
  stop();
} else if (action === 'status') {
  status();
} else if (action === 'restart') {
  restart();
}
